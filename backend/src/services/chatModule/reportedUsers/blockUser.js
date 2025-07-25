import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";

export class BlockUserHandler extends BaseHandler {
    async run() {
        const { description, reportedUserId, groupId, userId } = this.args
        const transaction = this.context.sequelizeTransaction
        if (userId.toString() === reportedUserId.toString()) throw new AppError(Errors.USER_CANNOT_REPORT)
        const isUserReported = await db.ReportedUser.findOne({
            where: { actioneeId: userId, reportedUserId },
            attributes: ['id', 'description','isUnblocked','actioneeId','reportedUserId','groupId'],
            transaction
        })
        if (isUserReported) {
            if (!isUserReported.isUnblocked) throw new AppError(Errors.USER_REPORTED)
            else {
                isUserReported.isUnblocked = false
                const report = await isUserReported.save({ transaction })
                return { data: report, message: SUCCESS_MSG.USER_REPORTED_SUCCESS }
            }
        } else {
            const reportedUserDetails = await db.User.findByPk(reportedUserId, {
                attributes: ['userId'],
                transaction
            })
            const reportingGroupDetail = await db.ChatGroup.findByPk(groupId, {
                attributes: ['id'],
                transaction
            })
            if (!reportedUserDetails || !reportingGroupDetail) throw new AppError(Errors.INVALID_INPUT)
            const report = await db.ReportedUser.create(
                {
                    actioneeId: userId,
                    reportedUserId,
                    description,
                    groupId,
                }, { transaction })
            return { data: report, message: SUCCESS_MSG.USER_REPORTED_SUCCESS }
        }
    }
}