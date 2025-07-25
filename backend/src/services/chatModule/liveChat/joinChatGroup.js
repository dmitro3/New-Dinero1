import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";

export class JoinChatGroupHandler extends BaseHandler {
    async run() {
        const transaction = this.context.sequelizeTransaction;
        const { chatGroupId, userId } = this.args
        const userChatGroup = await db.UserChatGroup.findOne({
            where: { chatGroupId, userId },
            transaction
        })
        if (userChatGroup) throw new AppError(Errors.GROUP_ALREADY_JOINED)
        const group = await db.ChatGroup.findOne({
            where: { id: chatGroupId },
            transaction
        })
        if (!group) throw new AppError(Errors.GROUP_NOT_FOUND)
        const groupJoined = await db.UserChatGroup.create({
            userId,
            chatGroupId,
            isActive: true
        }, { transaction })

        return { groupJoined: { ...groupJoined?.dataValues, ...group?.dataValues, isJoined: true }, message: SUCCESS_MSG.JOINED_SUCCESS }

    }
}