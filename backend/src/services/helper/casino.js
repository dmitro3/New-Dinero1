import CryptoJS from 'crypto-js'
import encode from 'crypto-js/enc-hex'
import crypto from 'crypto'

import db from '@src/db/models'
import { getOne } from './crud'
import { filterByDateCreatedAt } from '@src/utils/common'
import { ACTION, AMOUNT_TYPE, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '@src/utils/constant'
import { aleaCasinoConfig } from '@src/configs/casinoproviders/alea.config'

export const secureData = ({ data, key }) => {
  return CryptoJS.HmacMD5(data, key).toString(encode)
}

export const getLimitDates = () => {
  const today = new Date()

  let date = new Date()
  const offset = date.getTimezoneOffset()

  let monthStartDate = new Date((new Date(date.getFullYear(), date.getMonth(), 1)).getTime() - (offset * 60 * 1000))
  monthStartDate = monthStartDate.toISOString().split('T')[0]

  date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)

  const weekStartDate = new Date(date.setDate(diff))

  return {
    today: today.toISOString().substring(0, 10),
    monthStartDate,
    weekStartDate: weekStartDate.toISOString().substring(0, 10)
  }
}

export const getDepositLimitAmounts = async ({ userId }) => {
  const defaultQuery = {
    actioneeType: ROLE.USER,
    actioneeId: userId,
    transactionType: TRANSACTION_TYPE.DEPOSIT,
    status: TRANSACTION_STATUS.SUCCESS,
    amountType: AMOUNT_TYPE.CASH
  }

  const { today, monthStartDate, weekStartDate } = getLimitDates()
  const todayQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), today, today, 'TransactionBanking')
  const monthQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), monthStartDate, today, 'TransactionBanking')
  const weekQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), weekStartDate, today, 'TransactionBanking')

  return {
    totalDepositAmountToday: await db.TransactionBanking.sum('amount', { where: todayQuery }),
    totalDepositAmountWeekly: await db.TransactionBanking.sum('amount', { where: weekQuery }),
    totalDepositAmountMonthly: await db.TransactionBanking.sum('amount', { where: monthQuery })
  }
}

export const getWagerLimitAmounts = async ({ walletId }) => {
  const defaultQuery = {
    walletId,
    status: TRANSACTION_STATUS.SUCCESS,
    actionType: ACTION.BET
  }

  const { today, monthStartDate, weekStartDate } = getLimitDates()
  const todayQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), today, today, 'CasinoTransaction')
  const monthQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), monthStartDate, today, 'CasinoTransaction')
  const weekQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), weekStartDate, today, 'CasinoTransaction')

  return {
    totalBetAmountToday: await db.CasinoTransaction.sum('amount', { where: todayQuery }) + await db.CasinoTransaction.sum('nonCashAmount', { where: todayQuery }),
    totalBetAmountWeekly: await db.CasinoTransaction.sum('amount', { where: weekQuery }) + await db.CasinoTransaction.sum('nonCashAmount', { where: weekQuery }),
    totalBetAmountMonthly: await db.CasinoTransaction.sum('amount', { where: monthQuery }) + await db.CasinoTransaction.sum('nonCashAmount', { where: monthQuery })
  }
}

export const getLossLimitAmounts = async ({ userId }) => {
  const defaultQuery = {
    status: TRANSACTION_STATUS.SUCCESS
  }

  const { today, monthStartDate, weekStartDate } = getLimitDates()
  const todayQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), today, today, 'CasinoTransaction')
  const monthQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), monthStartDate, today, 'CasinoTransaction')
  const weekQuery = filterByDateCreatedAt(JSON.parse(JSON.stringify(defaultQuery)), weekStartDate, today, 'CasinoTransaction')

  const totalLossAmountToday = await db.CasinoTransaction.findOne({
    where: { ...todayQuery, userId },
    attributes: [
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `), 'amount'],
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `), 'nonCashAmount']
    ],
    raw: true
  })

  const totalLossAmountWeekly = await db.CasinoTransaction.findOne({
    where: { ...weekQuery, userId },
    attributes: [
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `), 'amount'],
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `), 'nonCashAmount']
    ],
    raw: true
  })

  const totalLossAmountMonthly = await db.CasinoTransaction.findOne({
    where: { ...monthQuery, userId },
    attributes: [
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then amount else 0 end) -
      sum(case when action_type = 'win' then amount else 0 end)as numeric),2) `), 'amount'],
      [db.sequelize.literal(`ROUND(cast(sum(case when action_type = 'bet' then non_cash_amount else 0 end) -
      sum(case when action_type = 'win' then non_cash_amount else 0 end)as numeric),2) `), 'nonCashAmount']
    ],
    raw: true
  })

  if (totalLossAmountToday === null) {
    totalLossAmountToday.amount = 0
    totalLossAmountToday.nonCashAmount = 0
  }
  if (totalLossAmountWeekly === null) {
    totalLossAmountWeekly.amount = 0
    totalLossAmountWeekly.nonCashAmount = 0
  }
  if (totalLossAmountMonthly === null) {
    totalLossAmountMonthly.amount = 0
    totalLossAmountMonthly.nonCashAmount = 0
  }

  return {
    totalLossAmountToday: parseFloat(totalLossAmountToday.amount + totalLossAmountToday.nonCashAmount),
    totalLossAmountWeekly: parseFloat(totalLossAmountWeekly.amount + totalLossAmountWeekly.nonCashAmount),
    totalLossAmountMonthly: parseFloat(totalLossAmountMonthly.amount + totalLossAmountMonthly.nonCashAmount)
  }
}

export const checkLimits = async ({ userId }) => {
  const userLimits = await getOne({
    model: db.Limit,
    data: { userId },
    raw: true
  })

  const wallet = await getOne({
    model: db.Wallet,
    data: { ownerId: userId },
    attributes: ['walletId']
  })

  const limitTable = {}

  const { totalBetAmountToday, totalBetAmountWeekly, totalBetAmountMonthly } = await getWagerLimitAmounts({ walletId: wallet.walletId })

  const { totalLossAmountToday, totalLossAmountWeekly, totalLossAmountMonthly } = await getLossLimitAmounts({ userId })

  limitTable.dailyBetLimit = { currentLimit: userLimits.dailyBetLimit || 'Not Set', usedLimit: parseFloat(totalBetAmountToday?.toFixed(2)), updatedAt: userLimits.dailyBetUpdatedAt, expiry: userLimits.dailyBetExpiry }
  limitTable.weeklyBetLimit = { currentLimit: userLimits.weeklyBetLimit || 'Not Set', usedLimit: parseFloat(totalBetAmountWeekly?.toFixed(2)), updatedAt: userLimits.weeklyBetUpdatedAt, expiry: userLimits.weeklyBetExpiry }
  limitTable.monthlyBetLimit = { currentLimit: userLimits.monthlyBetLimit || 'Not Set', usedLimit: parseFloat(totalBetAmountMonthly?.toFixed(2)), updatedAt: userLimits.monthlyBetUpdatedAt, expiry: userLimits.monthlyBetExpiry }

  limitTable.dailyLossLimit = { currentLimit: userLimits.dailyLossLimit || 'Not Set', usedLimit: parseFloat((totalLossAmountToday || 0).toFixed(2)), updatedAt: userLimits.dailyLossUpdatedAt, expiry: userLimits.dailyLossExpiry }
  limitTable.weeklyLossLimit = { currentLimit: userLimits.weeklyLossLimit || 'Not Set', usedLimit: parseFloat((totalLossAmountWeekly || 0).toFixed(2)), updatedAt: userLimits.weeklyLossUpdatedAt, expiry: userLimits.weeklyLossExpiry }
  limitTable.monthlyLossLimit = { currentLimit: userLimits.monthlyLossLimit || 'Not Set', usedLimit: parseFloat((totalLossAmountMonthly || 0).toFixed(2)), updatedAt: userLimits.monthlyLossUpdatedAt, expiry: userLimits.monthlyLossExpiry }

  return limitTable
}

export const checkDepositLimit = async ({ userId, depositAmount, tableOnly }) => {
  const userLimits = await getOne({
    model: db.Limit,
    data: { userId },
    raw: true
  })

  const { totalDepositAmountToday, totalDepositAmountWeekly, totalDepositAmountMonthly } = await getDepositLimitAmounts({ userId })

  const limitTable = {}

  limitTable.dailyDepositLimit = { currentLimit: userLimits.dailyDepositLimit || 'Not Set', usedLimit: parseFloat(totalDepositAmountToday?.toFixed(2)), updatedAt: userLimits.dailyDepositUpdatedAt, expiry: userLimits.dailyDepositExpiry }
  limitTable.weeklyDepositLimit = { currentLimit: userLimits.weeklyDepositLimit || 'Not Set', usedLimit: parseFloat(totalDepositAmountWeekly?.toFixed(2)), updatedAt: userLimits.weeklyDepositUpdatedAt, expiry: userLimits.weeklyDepositExpiry }
  limitTable.monthlyDepositLimit = { currentLimit: userLimits.monthlyDepositLimit || 'Not Set', usedLimit: parseFloat(totalDepositAmountMonthly?.toFixed(2)), updatedAt: userLimits.monthlyDepositUpdatedAt, expiry: userLimits.monthlyDepositExpiry }

  if (tableOnly) return { limitTable }

  if (userLimits.dailyDepositLimit && totalDepositAmountToday + depositAmount > userLimits.dailyDepositLimit) {
    return { limitReached: true, message: 'Daily Deposit limit reached', limitTable }
  }
  if (userLimits.weeklyDepositLimit && totalDepositAmountWeekly + depositAmount > userLimits.weeklyDepositLimit) {
    return { limitReached: true, message: 'Weekly Deposit limit reached', limitTable }
  }
  if (userLimits.monthlyDepositLimit && totalDepositAmountMonthly + depositAmount > userLimits.monthlyDepositLimit) {
    return { limitReached: true, message: 'Monthly Deposit limit reached', limitTable }
  }

  return { limitReached: false, limitTable }
}

export const getLimitTable = async (userId) => {
  const depositLimitTable = await checkDepositLimit({ userId, tableOnly: true })
  const otherLimits = await checkLimits({ userId })

  return { ...otherLimits, ...(depositLimitTable).limitTable }
}

export const verifySignature = args => {
  let str
  const { signature, stringData, ...request } = args
  console.log('!!!!!!!~~~~~~~~', request.type)
  switch (request.type) {
    case 'BALANCE': {
      const { casinoSessionId, currency, gameId, integratorId, softwareId } = request
      str = `${casinoSessionId}${currency}${gameId}${integratorId}${softwareId}${aleaCasinoConfig.secretKey}`
      break
    }
    case 'SESSION': {
      const { casinoSessionId } = request
      str = `${casinoSessionId}${aleaCasinoConfig.secretKey}`
      break
    }
    default:
      str = `${stringData}${aleaCasinoConfig.secretKey}`
      break
  }
  const sign = `SHA-512=${crypto
    .createHash('sha512')
    .update(str)
    .digest('hex')}`
  console.log('!!!!!!!~~~~~~~~', sign, signature)
  if (sign !== signature) return false
  return true
}