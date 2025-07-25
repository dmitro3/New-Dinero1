import { BaseHandler } from '@src/libs/logicBase'
import { COINS, TRANSACTION_PURPOSE } from '@src/utils/constants/public.constants'
import { SUCCESS_MSG } from '@src/utils/success'
import { generateSpinWheelIndex } from '../helper/spinWheel'
import { TransactionHandlerHandler } from '../wallet'
import { GetSpinWheelListHandler } from './getSpinWheelList'

export class GenerateSpinHandler extends BaseHandler {
  async run() {
    const { userId } = this.args

    const checkFaucetAvailability = await GetSpinWheelListHandler.execute(this.args)

    if (checkFaucetAvailability?.isAvailable === false)
      return checkFaucetAvailability

    const wheelConfiguration = checkFaucetAvailability.wheelConfiguration

    if (wheelConfiguration) {

      const { object, index } = await generateSpinWheelIndex(wheelConfiguration)

      if (object?.sc > 0)
        await TransactionHandlerHandler.execute({ userId, amount: object.sc, currencyCode: COINS.SWEEP_COIN.BONUS_SWEEP_COIN, purpose: TRANSACTION_PURPOSE.WHEEL_REWARD }, this.context)

      if (object?.gc > 0)
        await TransactionHandlerHandler.execute({ userId, amount: object.gc, currencyCode: COINS.GOLD_COIN, purpose: TRANSACTION_PURPOSE.WHEEL_REWARD }, this.context)

      return { message: SUCCESS_MSG.GET_SUCCESS, wheelConfiguration: { sc: object.sc, gc: object.gc }, index }
    } else {
      return { message: SUCCESS_MSG.GET_SUCCESS, wheelConfiguration: null, index: -1 }
    }
  }
}
