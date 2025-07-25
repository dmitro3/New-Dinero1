import { AppError } from '@src/errors/app.error'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { COINS } from '@src/utils/constants/public.constants'
import { AGGREGATORS } from 'dist/src/utils/constants/constants'
import { GetIpLocationHandler } from '../common/getIpLocation.service'
import { AleaGameLaunchHandler } from './providers/alea/aleaGameLaunchUrl.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'number' },
    ipAddress: { type: 'string' },
    userId: { type: 'string' },
    demo: { type: 'boolean' },
    aggregator: { type: 'string' },
    tournamentId: { type: 'number' }
  },
  required: ['gameId', 'demo', 'ipAddress', 'aggregator']
})

const AGGREGATOR_IDENTIFIERS_SERVICE_MAP = {
  [AGGREGATORS.ALEA.id]: AleaGameLaunchHandler
}

export class InitGameHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    const ipAddress = this.args.ipAddress
    const gameId = this.args.gameId
    const userId = this.args.userId
    const demo = this.args.demo
    const aggregator = this.args.aggregator
    const tournamentId = this.args.tournamentId

    try {
      const { result: country } = await GetIpLocationHandler.execute({ ipAddress: this.args.ipAddress }, this.context)

      const user = await this.context.sequelize.models.user.findOne({ where: { id: userId } })

      if (!user?.kycStatus) return this.addError('KycStatusErrorType', 'You need to complete KYC for enabling game play')

      const wallet = await this.context.sequelize.models.wallet.findOne({
        attributes: ['id'],
        where: { userId, isDefault: true },
        include: {
          attributes: ['id', 'code', 'type'],
          model: this.context.sequelize.models.currency
        }
      })

      if (!wallet) return this.addError('InvalidWalletIdErrorType')
      if (!AGGREGATOR_IDENTIFIERS_SERVICE_MAP[aggregator]) return this.addError('InvalidAggregatorType')

      const [gameLaunchResult] = await Promise.all([
        AGGREGATOR_IDENTIFIERS_SERVICE_MAP[aggregator].execute({
          ipAddress,
          isDemo: demo,
          userId,
          gameId,
          coinType: wallet.currency?.type || COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
          countryCode: country.code,
          tournamentId
        }, this.context)
        // ActiveBonusValidatorHandler.execute({ gameId, userId, currencyId: wallet.currency.id }, this.context)
      ])

      return { launchGameUrl: gameLaunchResult.result }
    } catch (error) {
      throw new AppError(error)
    }
  }
}
