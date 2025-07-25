import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { BaseHandler } from "@src/libs/logicBase";
import { MathPrecision } from "@src/libs/mathOperation";
import { TransactionHandlerHandler } from "@src/services/wallet";
import { LiveChatsEmitter } from "@src/socket-resources/emmitter/chat.emitter";
import { CLAIM_MESSAGE, GLOBAL_GROUP, GLOBAL_GROUP_ID, MESSAGE_TYPE } from "@src/utils/constants/chat.constants";
import { TRANSACTION_PURPOSE } from "@src/utils/constants/public.constants";
import { SUCCESS_MSG } from "@src/utils/success";


export class ClaimChatRainHandler extends BaseHandler {
    async run() {
        const transaction = this.context.sequelizeTransaction
        const { userId, chatRainId } = this.args
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

        const chatRainExist = await db.ChatRain.findOne({
            where: { id: chatRainId },
            attributes: ['id', 'description', 'prizeMoney', 'currencyId', 'isClosed', 'playerCount', 'userId'],
            transaction
        })
        if (!chatRainExist) throw new AppError(Errors.CHAT_RAIN_NOT_FOUND)
        if (chatRainExist.isClosed) throw new AppError(Errors.CHAT_RAIN_CLOSED)

        const checkClaimStatus = await db.ChatRainUser.findOne({
            where: { chatRainId, userId },
            attributes: ['id'],
            transaction
        })
        if (checkClaimStatus) throw new AppError(Errors.CHAT_RAIN_CLAIMED)
        const totalClaims = await db.ChatRainUser.count({
            where: { chatRainId },
            transaction
        })
        if (totalClaims >= chatRainExist.playerCount) throw new AppError(Errors.CHAT_RAIN_FULL)
        let claimedPrizeMoney = MathPrecision.divide(chatRainExist.prizeMoney, chatRainExist.playerCount)
        const claimData = await db.ChatRainUser.create({
            chatRainId,
            userId,
            winAmount: claimedPrizeMoney
        }, { transaction })

        await TransactionHandlerHandler.execute({
            adminId: chatRainExist.userId,
            userId,
            amount: claimData.winAmount,
            currencyCode: chatRainExist.currencyId,
            purpose: TRANSACTION_PURPOSE.CLAIM,
        }, this.context)

        if (totalClaims + 1 === chatRainExist.playerCount) {
            chatRainExist.isClosed = true;
            await chatRainExist.save({ transaction })

            // const userChat = await db.Message.create({
            //     actioneeId: userId,
            //     chatRainId: chatRainExist.id,
            //     message: CLAIM_MESSAGE,
            //     isPrivate: false,
            //     messageType: MESSAGE_TYPE.CHAT_RAIN,
            // }, { transaction })
            LiveChatsEmitter.emitLiveChats({
                // messageId: userChat.id,
                userId: parseInt(userId),
                username: user.username,
                profileImage: user.profileImage,
                message: CLAIM_MESSAGE,
                chatRainId,
                ChatRain: { id: chatRainId },
                description: chatRainExist.description,
                amount: chatRainExist.prizeMoney,
                currencyCode: chatRainExist.currencyId,
                isClosed: chatRainExist.isClosed,
                createdAt: dayjs(),
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
                }
            }, GLOBAL_GROUP)
        }
        // await ShareEventHandler.execute({
        //     title: chatRainExist.name,
        //     description: chatRainExist.description,
        //     image: '',
        //     // chatGroupId: chatRainExist.chatGroupId,
        //     redirectUrl: null,
        //     amount: chatRainExist.prizeMoney,
        //     currencyCode: chatRainExist.currencyId,
        //     eventType: MESSAGE_TYPE.CHAT_RAIN,
        //     userId: userExist.userId,
        // }, this.context)
        return { data: claimData, message: SUCCESS_MSG.CHAT_RAIN_CLAIMED }
    }
}