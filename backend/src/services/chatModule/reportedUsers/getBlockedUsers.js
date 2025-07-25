import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";
import { filterByDateCreatedAt, filterByDescription, pageValidation } from "@src/utils/common";
import { isNil, omitBy } from "lodash";

export class GetBlockedUserHandler extends BaseHandler {
    async run() {
        const { limit, pageNo, search, startDate, endDate } = this.args
        const userId = this.args.userId
        const { page, size } = pageValidation(pageNo, limit)
        const query = {
            actioneeId: userId,
            isUnblocked: false
        }
        if (search) query = filterByDescription(query, search)
        if (startDate || endDate) query = filterByDateCreatedAt(query, startDate, endDate, 'ReortedUser')
        const filterQuery = omitBy(query, isNil)
        const reportedUser = await db.ReportedUser.findAndCountAll({
            where: filterQuery,
            attributes: ['id', 'actioneeId', 'description', 'reportedUserId', 'groupId', 'isUnblocked'],
            include: [
                {
                    model: db.User,
                    as: 'reportedUsers',
                    attributes: ['email', 'firstName', 'lastName', 'username', 'profileImage'],
                }
            ],
            order: [['id', 'desc']],
            limit: size,
            offset: ((page - 1) * size),
        })
        return { data: reportedUser.rows, page, totalPages: Math.ceil(reportedUser.count / size) }
    }
}