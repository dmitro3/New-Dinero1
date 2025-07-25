import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { filterByDateCreatedAt } from '@src/utils/common'
import { TRANSACTION_STATUS_CASINO } from '@src/utils/constant'
import { topPlayerResponse } from '../helper/report'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] }
  }
}

export class GetCurrentWinnerHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    let { limit } = this.args


    let query = { status: TRANSACTION_STATUS_CASINO.COMPLETED }

    if (!limit && limit > 10) {
      limit = 10
    }

    const today = (new Date()).toISOString().substring(0, 10)

    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    query = filterByDateCreatedAt(query, lastWeek.toISOString().substring(0, 10), today, 'CasinoTransaction')

    const currentWinners = await db.CasinoTransaction.findAll({
      where: { ...query },
      attributes: [
        'gameId',
        'gameIdentifier',
        [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) /
          NULLIF(sum(case when action_type = 'bet' then amount else 0 end),0) * 100 as numeric),2)`), 'payoutPercentage'],
        [db.sequelize.literal('ROUND(cast(sum(case when action_type = \'win\' then amount else 0 end) as numeric),2)'), 'win']
      ],
      include: [
        {
          model: db.User,
          attributes: ['username', 'firstName', 'lastName', 'currencyCode']
        }],
      group: [
        db.sequelize.col('game_id'),
        db.sequelize.col('User.username'),
        db.sequelize.col('game_identifier'),
        db.sequelize.col('User.first_name'),
        db.sequelize.col('User.last_name'),
        db.sequelize.col('User.currency_code')
      ],
      order: [[db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) /
        NULLIF(sum(case when action_type = 'bet' then amount else 0 end),0) * 100 as numeric),2)`), 'DESC']],
      having: db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'win' then amount else 0 end) /
        NULLIF(sum(case when action_type = 'bet' then amount else 0 end),0) * 100 as numeric),2) >= 100`),
      limit,
      offset: 0,
      raw: true
    })

    return { currentWinners: await topPlayerResponse(currentWinners, true) }

  }
}
