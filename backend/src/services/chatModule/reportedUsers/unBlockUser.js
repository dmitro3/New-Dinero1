import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";

export class UnBlockUserHandler extends BaseHandler {
    async run() {
        const { reportedUserId, groupId } = this.args
        const transaction = this.context.sequelizeTransaction
        const reportData = await db.ReportedUser.findOne({
            where: { reportedUserId, groupId },
            attributes:['id'],
            transaction
        })
        if (!reportData) throw new AppError(Errors.INVALID_INPUT)
        await db.ReportedUser.update({ isUnblocked: true }, { where: { reportedUserId, groupId }, transaction })
        return { message: SUCCESS_MSG.REPORT_UPDATE_SUCCESS }
    }
}