import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
// import { TRANSACTION_TYPE } from '@src/utils/constant'
// import { BONUS_TYPE, BONUS_STATUS, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants'
import { BONUS_STATUS, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants'
// import { SUCCESS_MSG } from '@src/utils/success'
// import { Op, Sequelize } from 'sequelize'
import { Op } from 'sequelize'

export class AvailBonusHandler extends BaseHandler {
  async run () {
    const { userId, bonusId } = this.args
    const transaction = this.context.sequelizeTransaction

  
      const bonusExists = await db.Bonus.findOne({
        where: { id: bonusId, status: BONUS_STATUS.ACTIVE },
        attributes: ['id', 'daysToClear']
      })
      if (!bonusExists) throw new AppError(Errors.BONUS_NOT_FOUND)

      const userBonus = await db.UserBonus.findOne({
        where: { userId, bonusId, bonusStatus: { [Op.in]: ['active', 'completed'] } },
        attributes: ['id'],
        transaction
      })
      if (userBonus) throw new AppError(Errors.BONUS_ACTIVE)

      const activeBonus = await db.UserBonus.findOne({
        where: {
          userId, bonusStatus: { [Op.in]: ['active', 'completed'] }
        },
        attributes: ['id'],
        transaction
      })
      if (activeBonus) throw new AppError(Errors.USER_BONUS)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + bonusExists.daysToClear)
      const createBonus = await db.UserBonus.create({
        bonusId: bonusExists.id,
        userId,
        status: USER_BONUS_STATUS_VALUES.ACTIVE,
        awardedAt: new Date(),
        expiryDate: expiryDate,
        bonusAmount: 0
      }, { transaction })

      return { createBonus }
   
  }
}