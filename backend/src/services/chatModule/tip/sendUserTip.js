import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { BaseHandler } from "@src/libs/logicBase";
import { MathPrecision } from "@src/libs/mathOperation";
import { CreateLedgerHandlerHandler, TransactionHandlerHandler } from "@src/services/wallet";
import { LiveChatsEmitter } from "@src/socket-resources/emmitter/chat.emitter";
import { GLOBAL_GROUP, GLOBAL_GROUP_ID, MESSAGE_TYPE, TIP_SEND } from "@src/utils/constants/chat.constants";
import { COINS, LEDGER_DIRECTIONS, LEDGER_TRANSACTION_TYPES, TRANSACTION_PURPOSE } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from "@src/utils/success";
import { Op } from "sequelize";

export class SendUserTipHandler extends BaseHandler {
    async run() {
        const { tipUsername, tipAmount, currencyCode, userId, isPublic } = this.args
        const transaction = this.context.sequelizeTransaction;
        const isGoldCoin = currencyCode === COINS.GOLD_COIN
        const walletFilter = isGoldCoin ? [COINS.GOLD_COIN] : [
            COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
            COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
            COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
        ];
        // const user = await db.User.findOne({
        //     where: { userId: userId },
        //     attributes: ['username', 'profileImage'],
        //     transaction
        // });
        const user = await db.User.findByPk(userId, {
            attributes: ['userId', 'username', 'profileImage', 'isEmailVerified'],
            include: [{
                model: db.UserDetails,
                as: "userDetails",
                attributes: ['id'],
                include: [{
                    model: db.VipTier,
                    as: "VipTier",
                    attributes: ['vipTierId', 'name', 'level']
                }]
            }],
            transaction
        })
        const tipUser = await db.User.findOne({
            where: { username: tipUsername, userId: { [Op.ne]: userId } },
            attributes: ['userId', 'username'],
            transaction
        });
        if (!tipUser) throw new AppError(Errors.USER_NOT_EXISTS)

        const wallets = await db.Wallet.findAll({
            where: { userId, currencyCode: { [Op.in]: walletFilter } },
            lock: true,
            transaction,
        });
        const totalBalance = wallets.reduce((total, wallet) => MathPrecision.plus(total, wallet.balance), 0)
        if (totalBalance < tipAmount) throw new AppError(Errors.INSUFFICIENT_FUNDS)

        const tipSenderTransaction = await db.Transaction.create({
            userId,
            purpose: TRANSACTION_PURPOSE.SEND_TIP,
            moreDetails: {
                tipSenderId: userId,
                tipReceiverId: tipUser.userId,
            }
        }, { transaction })
        const tipReceiverTransaction = await db.Transaction.create({
            userId: tipUser.userId,
            actioneeId: userId,
            purpose: TRANSACTION_PURPOSE.RECEIVE_TIP,
            moreDetails: {
                tipSenderId: userId,
                tipReceiverId: tipUser.userId,
            }
        }, { transaction })

        const tip = await db.Tip.create({
            userId,
            recipientId: tipUser.userId,
            amount: tipAmount,
            currencyId: currencyCode
        }, { transaction });

        // let finalCurrencyCode = currencyCode;

        // if (currencyCode === COINS.SWEEP_COIN.BONUS_SWEEP_COIN) {
        //     for (const currencyCode of walletFilter) {
        //         const wallet = wallets.find((w) => w.currencyCode === currencyCode);
        //         if (wallet.balance >= tipAmount) {
        //             finalCurrencyCode = wallet.currencyCode
        //             break;
        //         }
        //     }
        // }

        let remainingAmount = tipAmount
        if (currencyCode === COINS.GOLD_COIN) {
            await CreateLedgerHandlerHandler.execute(
                {
                    amount: tipAmount,
                    walletId: wallets[0].id,
                    transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
                    userId: userId,
                    direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.SEND_TIP],
                    transactionId: tipSenderTransaction.transactionId,
                    currencyCode: wallets[0].currencyCode
                },
                this.context
            )
            await CreateLedgerHandlerHandler.execute(
                {
                    amount: tipAmount,
                    walletId: wallets[0].id,
                    transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
                    userId: tipUser.userId,
                    direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.RECEIVE_TIP],
                    transactionId: tipReceiverTransaction.transactionId,
                    currencyCode: wallets[0].currencyCode
                },
                this.context
            )
        } else {
            const walletOrder = [
                COINS.SWEEP_COIN.BONUS_SWEEP_COIN,
                COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
                COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
            ]
            for (const currencyCode of walletOrder) {
                const wallet = wallets.find((w) => w.currencyCode === currencyCode)
                if (wallet && remainingAmount > 0) {
                    const deductionAmount = Math.min(remainingAmount, wallet.balance)
                    if (deductionAmount > 0) {
                        await CreateLedgerHandlerHandler.execute(
                            {
                                amount: deductionAmount,
                                walletId: wallet.id,
                                transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
                                userId: userId,
                                direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.SEND_TIP],
                                transactionId: tipSenderTransaction.transactionId,
                                currencyCode: wallet.currencyCode,
                            },
                            this.context
                        )
                        await CreateLedgerHandlerHandler.execute(
                            {
                                amount: deductionAmount,
                                walletId: wallet.id,
                                transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
                                userId: tipUser.userId,
                                direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.RECEIVE_TIP],
                                transactionId: tipReceiverTransaction.transactionId,
                                currencyCode: wallet.currencyCode,
                            },
                            this.context
                        )
                        remainingAmount = MathPrecision.minus(remainingAmount, deductionAmount)

                    }
                }
                if (remainingAmount <= 0) break
            }
        }

        // await TransactionHandlerHandler.execute({
        //     adminId: userId,
        //     userId,
        //     amount: tipAmount,
        //     currencyCode: finalCurrencyCode,
        //     purpose: TRANSACTION_PURPOSE.SEND_TIP,
        // }, this.context)

        // await TransactionHandlerHandler.execute({
        //     adminId: userId,
        //     userId: tipUser.userId,
        //     amount: tipAmount,
        //     currencyCode: finalCurrencyCode,
        //     purpose: TRANSACTION_PURPOSE.RECEIVE_TIP,
        // }, this.context)

        if (isPublic) {
            const userChat = await db.Message.create({
                actioneeId: userId,
                message: TIP_SEND,
                isPrivate: false,
                messageType: MESSAGE_TYPE.TIP,
                tipId: tip.id
            }, { transaction })

            LiveChatsEmitter.emitLiveChats({
                messageId: userChat.id,
                userId: parseInt(userId),
                username: user.username,
                profileImage: user.profileImage,
                message: TIP_SEND,
                messageType: MESSAGE_TYPE.TIP,
                createdAt: dayjs(),
                tip: tip,
                amount: tipAmount,
                tipUser: tipUsername,
                currencyCode,
                user: {
                    userId: user.userId,
                    profileImage: user.profileImage,
                    username: user.username,
                    isEmailVerified: user.isEmailVerified,
                    userDetails: {
                        VipTier: {
                            vipTierId: user.userDetails?.VipTier?.vipTierId,
                            name: user.userDetails?.VipTier?.name,
                            level: user.userDetails?.VipTier?.level
                        }
                    }
                    // rankingLevel: userSettings?.displayLevel === 'true' ? user.rankingLevel : null,
                    // rankingName: userSettings?.displayLevel === 'true' ? user.rankingName : null
                    //make clarify
                },
            }, GLOBAL_GROUP)
        }

        return { message: SUCCESS_MSG.TIP_SUCCESS }

    }
}