import db from '@src/db/models'
import { dayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { TRANSACTION_PURPOSE } from '@src/utils/constants/public.constants'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetSpinWheelListHandler extends BaseHandler {
  async run() {
    const { userId } = this.args
    // Fetch the user's last spin wheel transaction
    const lastWheelRewardAwail = await db.Transaction.findOne({
      where: { userId, purpose: TRANSACTION_PURPOSE.WHEEL_REWARD },
      attributes: ['createdAt'],
      order: [['createdAt', 'DESC']]
    })

    // Check if the user has already availed wheel reward recently
    if (lastWheelRewardAwail) {
      const msInOneDay = 86400000
      const timeDifference = dayjs().diff(dayjs(lastWheelRewardAwail.createdAt))
      if (timeDifference < msInOneDay) {
        return {
          isAvailable: false,
          timeRemainingForNextSpin: msInOneDay - timeDifference,
          message: SUCCESS_MSG.GET_SUCCESS,
        }
      }
    }


    const wheelConfiguration = await db.WheelDivisionConfiguration.findAll({
      attributes: ['sc', 'gc', 'isAllow'],
      order: [['wheelDivisionId', 'ASC']]
    })
    return { wheelConfiguration }
  }
}
