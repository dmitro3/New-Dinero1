import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { filterByGroupName, pageValidation } from "@src/utils/common";
import { SUCCESS_MSG } from "@src/utils/success";
import { isNil, omitBy } from "lodash";
import sequelize, { Op } from "sequelize";

export class GetChatGroupHandler extends BaseHandler {
    async run() {
        const { limit, pageNo, search, startDate, endDate, userId } = this.args
        let query = {}
        if (search) query = filterByGroupName(query, search)
        const { page, size } = pageValidation(pageNo, limit)
        const filterQuery = omitBy(query, isNil)
        if (startDate || endDate) query = filterByDateCreatedAt(query, startDate, endDate, 'ChatGroup')
        let include = []
        let userDetails
        const attributes = ['id', 'name', 'description', 'status', 'createdAt', 'isGlobal']
        if (userId) {
            userDetails = await db.User.findOne({ where: { userId: userId } })
            include = [{
                model: db.UserChatGroup,
                as: 'userChatGroups',
                where: { userId },
                required: false,
                attributes: []
            }]
            attributes.push([sequelize.literal('CASE WHEN "userChatGroups"."id" IS NOT NULL THEN TRUE ELSE FALSE END'), 'isJoined'])
            filterQuery[Op.or] = [
                sequelize.where(sequelize.col('userChatGroups.is_active'), '=', true),
                sequelize.where(sequelize.col('userChatGroups.is_active'), '=', null)]
        }
        const groupDetails = await db.ChatGroup.findAndCountAll({
            where: filterQuery,
            subQuery: false,
            include,
            attributes,
            order: [['id', 'desc']],
            limit: size,
            offset: ((page - 1) * size)
        })
        if (!groupDetails) throw new AppError(Errors.GROUP_NOT_FOUND)
        else return { data: groupDetails.rows, page, totalPages: Math.ceil(groupDetails.count / size), message: SUCCESS_MSG.GET_SUCCESS }
    }
}