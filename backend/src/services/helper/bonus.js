import { Op, Sequelize } from 'sequelize'

import db from '@src/db/models'
import { ACTION, AMOUNT_TYPE, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '@src/utils/constant'

export const getCashbackParameters = async (level, bonus) => {
  const data = bonus.other.loyaltyLevel.find(object => object.level === level)

  const bonusPercentage = data.bonusPercentage
  const wageringMultiplier = data.cashback_multiplier
  const maximumBonus = parseFloat(data?.maxBonusThreshold)

  return { bonusPercentage, wageringMultiplier, maximumBonus }
}

export const totalWins = async (fromDate, toDate, userId) => {
  const wins = await db.CasinoTransaction.sum('amount', {
    where: {
      userId,
      actionType: ACTION.WIN,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '>=', new Date(fromDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '<=', new Date(toDate))
      ]
    }
  })

  return wins
}

export const totalBets = async (fromDate, toDate, userId) => {
  const bets = await db.CasinoTransaction.sum('amount', {
    where: {
      userId,
      isSticky: false,
      actionType: ACTION.BET,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '>=', new Date(fromDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '<=', new Date(toDate))
      ]
    }
  })

  return bets
}

export const totalDeposit = async (fromDate, toDate, userId) => {
  const total = await db.TransactionBanking.sum('amount', {
    where: {
      actioneeId: userId,
      actioneeType: ROLE.USER,
      amountType: AMOUNT_TYPE.CASH,
      status: TRANSACTION_STATUS.SUCCESS,
      transactionType: TRANSACTION_TYPE.DEPOSIT,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '>=', new Date(fromDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '<=', new Date(toDate))
      ]
    }
  })

  return total
}
