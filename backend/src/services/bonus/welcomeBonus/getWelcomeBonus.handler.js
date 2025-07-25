import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { BONUS_STATUS, BONUS_TYPE } from '@src/utils/constants/bonus.constants'


export class GetWelcomeBonusHandler extends BaseHandler {
    get constraints() {
        return constraints
    }

    async run() {

        const activeBonus = await db.Bonus.findOne({
            where: { status: BONUS_STATUS.ACTIVE, bonusType: BONUS_TYPE.WELCOME },
            attributes: ['id', 'status', 'gcAmount', 'scAmount', 'promotionTitle', 'description'],
        })

        return { success: true, welcomeBonus: activeBonus }

    }
}
