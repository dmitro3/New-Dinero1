import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { Logger } from "@src/libs/logger";
import { BaseHandler } from "@src/libs/logicBase";
import { LiveChatsEmitter } from "@src/socket-resources/emmitter/chat.emitter";
import { containsLink, isContainOffensiveWord } from "@src/utils/chat.utils";
import { DELETED_MESSAGE, MAX_CHAT_CHARACTERS, MESSAGE_TYPE, URL_CHAT_MESSAGE } from "@src/utils/constants/chat.constants";
import { S3_FILE_PREFIX } from "@src/utils/constants/constants";
import { s3FileUpload } from "@src/utils/s3.utils";

export class SendMessageHandler extends BaseHandler {

    async run() {
        const { message, isPrivate, groupId, userId, messageType, tempMessageId } = this.args
        const transaction = this.context.sequelizeTransaction

        if (!message || message.trim().length === 0) throw new AppError(Errors.EMPTY_MESSAGE)
        switch (messageType) {
            case MESSAGE_TYPE.MESSAGE:
                if (!message.length > 0) throw new AppError(Errors.MESSAGE_TYPE_MISSMATCH)
                break
            case MESSAGE_TYPE.GIF:
                if (!message.length > 0) throw new AppError(Errors.MESSAGE_TYPE_MISSMATCH)
                break
            case MESSAGE_TYPE.SHARED_EVENT:
                throw new AppError(Errors.MESSAGE_TYPE_MISSMATCH)
            default:
                throw new AppError(Errors.MESSAGE_TYPE_MISSMATCH)
        }

        let offensiveWords, offensiveWordsArray, result = false, checkUrl, gifUrl
        if (messageType === MESSAGE_TYPE.MESSAGE && message) {
            if (message.length > MAX_CHAT_CHARACTERS) throw new AppError(Errors.EXCEED_CHAT_LENGTH)
            offensiveWords = await db.OffensiveWord.findAll({
                attributes: ['word'],
                transaction
            })
            offensiveWordsArray = offensiveWords.map(row => row.word)
            result = isContainOffensiveWord(message, offensiveWordsArray)
            checkUrl = containsLink(message)
        }
        else if (messageType === MESSAGE_TYPE.GIF && message) {
            gifUrl = message.trim();
            const gifUrlRegex = /^(https?:\/\/.*\.(?:gif))$/i;
            if (!gifUrlRegex.test(gifUrl)) throw new AppError(Errors.INVALID_URL);

        }
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
        if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
        const createChat = {
            actioneeId: userId,
            message: (result) ? `${DELETED_MESSAGE}` : (checkUrl) ? `${URL_CHAT_MESSAGE}` : (messageType === MESSAGE_TYPE.GIF) ? `${gifUrl}` : message || null,
            isContainOffensiveWord: result,
            isPrivate: isPrivate || false,
            messageType: messageType
        }
        try {
            const userChat = await db.Message.create(createChat, { transaction })
            LiveChatsEmitter.emitLiveChats({
                messageId: userChat.id,
                id: userChat.id,
                message: (result) ? `${DELETED_MESSAGE}` : (checkUrl) ? `${URL_CHAT_MESSAGE}` : (messageType === MESSAGE_TYPE.GIF) ? `${gifUrl}` : message || null,
                userId: parseInt(userId),
                groupId: groupId,
                isContainOffensiveWord: result,
                messageType,
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
                },
                tempMessageId // Include temporary client message ID in emitted message
            }, groupId)
            return { isContainOffensiveWord: result }
        } catch (error) {
            Logger.error(error)
        }

    }

}