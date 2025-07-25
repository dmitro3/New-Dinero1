import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { pageValidation } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
    type: 'object',
    properties: {
        limit: { type: 'string' },
        pageNo: { type: 'string' },
        isActive: { type: 'boolean' },
    },
    required: []
}

export class GetDropBonusesHandler extends BaseHandler {
    get constraints() {
        return schema
    }

    async run() {
        const { limit, pageNo, isActive } = this.args

        // Validate pagination parameters
        const { page, size } = pageValidation(pageNo, limit)

        // Build the query filter
        const filter = {}
        if (typeof isActive !== 'undefined') {
            filter.isActive = isActive
        }
        const dropBonuses = await db.DropBonus.findAndCountAll({
            where: filter,
            attributes: ['id', 'coin', 'name', 'code', 'totalClaimsAllowed', 'totalClaims', 'expiryTime', 'isActive'],
            limit: size,
            offset: (page - 1) * size,
            order: [['createdAt', 'DESC']]
        })

        return {
            data: {
                dropBonuses: (dropBonuses.rows || 0),
                totalCount: (dropBonuses.count || 0),
                page,
                size,
            },
            message: SUCCESS_MSG.GET_SUCCESS
        }
    }
}