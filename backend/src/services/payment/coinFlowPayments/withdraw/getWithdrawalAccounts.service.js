import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/logicBase'
import axios from 'axios'
const { Op } = require('sequelize')

export class GetCoinFlowUserWithdrawalAccountsService extends BaseHandler {
  async run () {
    try {
      const { userId, paymentType } = this.args
      const sessionKeyRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/auth/session-key`, {
        headers: {
          'x-coinflow-auth-user-id': String(userId),
          Authorization: config.get('coinFlow.apiKey'),
        },
      })

      const sessionKey = sessionKeyRes?.data?.sessionKey || sessionKeyRes?.data?.key
      if (!sessionKey) throw new AppError(Errors.INTERNAL_ERROR)
      const withdrawRes = await axios.get(`${config.get('coinFlow.baseUrl')}/api/withdraw`, {
        headers: {
          accept: 'application/json',
          'x-coinflow-auth-session-key': sessionKey,
        },
      })

      const withdrawer = withdrawRes?.data?.withdrawer
      if (!withdrawer) throw new AppError(Errors.INTERNAL_ERROR)

      const bankAccounts = withdrawer.bankAccounts || []
      const cards = withdrawer.cards || []

      for (const bank of bankAccounts) {
        const existing = await db.PaymentDetail.findOne({
          where: {
            userId,
            token: bank.token,
            lastFourDigits: bank.last4,
            paymentType: 'ACH',
          },
        })
        if (existing) {
          if (!existing.hasWithdrawalPermission) {
            await existing.update({ hasWithdrawalPermission: true })
          }
        } else {
          await db.PaymentDetail.create({
            userId,
            paymentType: 'ACH',
            token: bank.token,
            lastFourDigits: bank.last4,
            provider: bank.alias,
            isActive: true,
            achAccessToken: null,
            hasCheckoutPermission: false,
            hasWithdrawalPermission: true,
          })
        }
      }

      for (const card of cards) {
        const existing = await db.PaymentDetail.findOne({
          where: {
            userId,
            token: card.token,
            lastFourDigits: card.last4,
            paymentType: 'CARD',
          },
        })

        if (existing) {
          if (!existing.hasWithdrawalPermission) {
            await existing.update({ hasWithdrawalPermission: true, provider: card.type })
          }
        } else {
          await db.PaymentDetail.create({
            userId,
            paymentType: 'CARD',
            token: card.token,
            lastFourDigits: card.last4,
            provider: card.type,
            isActive: true,
            achAccessToken: null,
            hasCheckoutPermission: false,
            hasWithdrawalPermission: true,
          })
        }
      }
      const allAccounts = await db.PaymentDetail.findAll({
        where: {
          userId,
          isActive: true,
          token: { [Op.not]: null },
          // paymentType: { [Op.in]: paymentType ? [paymentType] : ['ACH', 'CARD'] },
          paymentType: { [Op.in]: ['ACH', 'CARD'] },
          hasWithdrawalPermission: true,
        },
        attributes: [
          'id',
          'userId',
          'paymentType',
          'lastFourDigits',
          'provider',
          // 'hasCheckoutPermission',
          // 'hasWithdrawalPermission',
        ],
      })

      return {
        success: true,
        data: allAccounts,
      }

    } catch (error) {
      Logger.error('Error in GetCoinFlowUserWithdrawalAccountsService', { exception: error })
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 401) {
          throw new AppError(Errors.ACCOUNT_DETAILS_NOT_FOUND)
        }
      }
      throw new AppError(Errors.INTERNAL_ERROR)
    }
  }
}
