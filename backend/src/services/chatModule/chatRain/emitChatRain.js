import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { BaseHandler } from "@src/libs/logicBase";
import { MathPrecision } from "@src/libs/mathOperation";
import { CreateLedgerHandlerHandler, TransactionHandlerHandler } from "@src/services/wallet";
import { LiveChatsEmitter } from "@src/socket-resources/emmitter/chat.emitter";
import { GLOBAL_GROUP, GLOBAL_GROUP_ID, MESSAGE_TYPE } from "@src/utils/constants/chat.constants";
import { COINS, LEDGER_DIRECTIONS, LEDGER_TRANSACTION_TYPES, TRANSACTION_PURPOSE } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from "@src/utils/success";
import { Op } from "sequelize";

export class CreateChatRainHandler extends BaseHandler {
    async run() {
        const { rainAmount, playerCount, message, currencyCode, userId, groupId } = this.args
        const transaction = this.context.sequelizeTransaction
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
        const wallets = await db.Wallet.findAll({
            where: { userId, currencyCode: { [Op.in]: walletFilter } },
            lock: true,
            transaction,
        });
        const totalBalance = wallets.reduce((total, wallet) => MathPrecision.plus(total, wallet.balance), 0)
        if (totalBalance < rainAmount) throw new AppError(Errors.INSUFFICIENT_FUNDS)
        const chatRainTransaction = await db.Transaction.create({
            userId,
            purpose: TRANSACTION_PURPOSE.EMIT,
        }, { transaction })
        const newChatRain = await db.ChatRain.create(
            {
                userId: userId,
                description: message,
                currencyId: currencyCode,
                prizeMoney: rainAmount,
                playerCount: playerCount,
                isClosed: false
            }, { transaction })
        let remainingAmount = rainAmount

        if (currencyCode === COINS.GOLD_COIN) {
            await CreateLedgerHandlerHandler.execute(
                {
                    amount: rainAmount,
                    walletId: wallets[0].id,
                    transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
                    userId: userId,
                    direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.EMIT],
                    transactionId: chatRainTransaction.transactionId,
                    currencyCode: wallets[0].currencyCode,
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
                                direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.EMIT],
                                transactionId: chatRainTransaction.transactionId,
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

        // let finalCurrencyCode = currencyCode;
        // if (currencyCode === COINS.SWEEP_COIN.BONUS_SWEEP_COIN) {
        //     for (const currencyCode of walletFilter) {
        //         const wallet = wallets.find((w) => w.currencyCode === currencyCode);
        //         if (wallet.balance >= rainAmount) {
        //             finalCurrencyCode = wallet.currencyCode
        //             break;
        //         }
        //     }
        // }
        // const newChatRain = await db.ChatRain.create(
        //     {
        //         userId: userId,
        //         description: message,
        //         currencyId: finalCurrencyCode,
        //         prizeMoney: rainAmount,
        //         playerCount: playerCount,
        //         isClosed: false
        //     }, { transaction })

        const userChat = await db.Message.create({
            actioneeId: userId,
            chatRainId: newChatRain.id,
            message,
            isPrivate: false,
            messageType: MESSAGE_TYPE.CHAT_RAIN,
        }, { transaction })


        // await TransactionHandlerHandler.execute({
        //     adminId: userId,
        //     userId,
        //     amount: rainAmount,
        //     currencyCode: finalCurrencyCode,
        //     purpose: TRANSACTION_PURPOSE.EMIT,
        // }, this.context)

        LiveChatsEmitter.emitLiveChats({
            messageId: userChat.id,
            userId: parseInt(userId),
            username: user.username,
            profileImage: user.profileImage,
            message,
            messageType: MESSAGE_TYPE.CHAT_RAIN,
            createdAt: dayjs(),
            ChatRain: newChatRain,
            amount: rainAmount,
            currencyCode,
            playerCount,
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
            }
        }, groupId || GLOBAL_GROUP)

        // LiveChatRainEmitter.emitLiveChatRain({
        //     chatRainId: newChatRain.id,
        //     userId: newChatRain.userId,
        //     description: newChatRain.description,
        //     prizeMoney: newChatRain.prizeMoney,
        //     playerCount: newChatRain.playerCount,
        //     currency: newChatRain.currencyId,
        //     isClosed: newChatRain.isClosed,
        // }, GLOBAL_GROUP_ID)

        return { message: SUCCESS_MSG.CHAT_RAIN_EMIT }
    }
}