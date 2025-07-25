import { Op } from 'sequelize'
import db from '@src/db/models'


export const MODEL_TYPE = {
  CASINO: 'casino-transaction',
  BANKING: 'transaction-banking'
}

export const getGameAggregatorAndProvider = async (game) => {
  const gameData = await db.CasinoGame.findOne({
    where: { identifier: { [Op.iLike]: game } },
    attributes: ['casinoGameId', 'name', 'thumbnailUrl'],
    include: [{
      model: db.CasinoProvider,
      as: 'CasinoProvider',
      attributes: ['name']
    }],
    raw: true
  })

  const returnData = {
    thumbnailUrl: gameData.thumbnailUrl,
    provider: gameData['CasinoProvider.name'],
    gameName: gameData.name,
    gameId: gameData?.casinoGameId
  }

  return returnData
}

export const createGameReport = async (gameReport, type, userId, limit) => {
  const response = []

  for (const provider of gameReport.date.buckets.transactions.group_by_provider.buckets) {
    response.push({
      identifier: provider?.key,
      roundCount: provider.totalBet.count.value,
      ...await getGameAggregatorAndProvider(provider?.key)
    })
  }

  response.sort((a, b) => {
    return parseInt(b - a)
  })

  return response.slice(0, limit)
}

export const internationalNumberFormatter = (number) => {
  return new Intl.NumberFormat('en-EU').format(number)
}

export const topPlayerResponse = async (data, game) => {
  const response = []
  data.forEach(object => {
    const newData = {}
    Object.keys(object).forEach(key => {
      const newKey = key.split('.')[key.split('.').length - 1]
      newData[newKey] = object[key]
      if (newKey === 'amount') {
        newData[newKey] = internationalNumberFormatter(object[key])
      }
    })
    response.push(newData)
  })

  if (game) {
    for (let index = 0; index < response.length; index++) {
      response[index] = {
        ...response[index],
        ...await getGameAggregatorAndProvider(response[index].gameIdentifier)
      }
    }
  }
  return response
}
