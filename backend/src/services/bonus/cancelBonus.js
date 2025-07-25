import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants'
import { SUCCESS_MSG } from '@src/utils/success'

export class CancelBonusHandler extends BaseHandler {
  async run() {
    const { userId, userBonusId } = this.args
    const transaction = this.context.sequelizeTransaction


    const userBonusExists = await db.UserBonus.findOne({
      where: { userId, id: userBonusId },
      include: { model: db.Bonus, as: 'bonus', attributes: ['id', 'promotionTitle'] }
    })

    if (!userBonusExists) throw new AppError(Errors.BONUS_NOT_FOUND)

    await userBonusExists.set({ bonusStatus: USER_BONUS_STATUS_VALUES.FORFEITED }).save({ transaction })

    return { success: true, message: SUCCESS_MSG.CANCEL_SUCCESS }

  }
}
