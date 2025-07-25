import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { BaseHandler } from "@src/libs/logicBase";
import { LiveChatsEmitter } from "@src/socket-resources/emmitter/chat.emitter";
import { MESSAGE_TYPE } from "@src/utils/constants/chat.constants";
import { SUCCESS_MSG } from "@src/utils/success";

export class ShareEventHandler extends BaseHandler {
    async run() {
        const transaction = this.context.sequelizeTransaction
        const { title, description, image, chatGroupId, redirectUrl, amount, currencyCode, eventType, userId } = this.args

        const userData = await db.User.findOne({
            where: { userId: userId },
            attributes: ['userId', 'username', 'profileImage'],
            transaction
        })
        if (userData) {
            const userChatGroupPresent = await db.UserChatGroup.findOne({
                where: { userId: userData.userId, chatGroupId },
                attributes: ['id'],
                transaction,
            })
            if (userChatGroupPresent) {
                const eventDetails = {
                    eventTitle: title,
                    eventDescription: description,
                    eventImage: image,
                    eventURL: redirectUrl,
                    eventAmount: amount,
                    amountCurrency: currencyCode,
                    eventType: eventType
                }
                const userChat = await db.Message.create({
                    actioneeId: userData.userId,
                    chatGroupId: chatGroupId || null,
                    messageType: eventType === MESSAGE_TYPE.CHAT_RAIN ? MESSAGE_TYPE.CHAT_RAIN : MESSAGE_TYPE.SHARED_EVENT,
                    isPrivate: false,
                }, { transaction })

                LiveChatsEmitter.emitLiveChats({
                    messageId: userChat.id,
                    userId: userData.userId,
                    groupId: chatGroupId,
                    recipientId: null,
                    recipientUser: null,
                    sharedEvent: eventDetails,
                    messageType: eventType === MESSAGE_TYPE.CHAT_RAIN ? MESSAGE_TYPE.CHAT_RAIN : MESSAGE_TYPE.SHARED_EVENT,
                    createdAt: dayjs(),
                    user: {
                        userName: userData.username,
                        profilePicture: userData.profileImage,
                    }
                }, chatGroupId)

                return { message: SUCCESS_MSG.EVENT_SHARED_SUCCESS }
            } else {
                throw new AppError(Errors.GROUP_NOT_JOINED)
            }
        }
        throw new AppError(Errors.USER_NOT_EXISTS)
    }
}