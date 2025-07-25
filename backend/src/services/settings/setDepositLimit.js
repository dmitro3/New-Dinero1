import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import ajv from '@src/libs/ajv'
import db from '@src/db/models'
import { getOne } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'
import { comparePassword } from '@src/utils/common'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    user: { type: 'object' },
    daily: { type: ['string', 'null', 'boolean'] },
    weekly: { type: ['string', 'null', 'boolean'] },
    monthly: { type: ['string', 'null', 'boolean'] },
    reset: { type: 'boolean' },
    password: { type: 'string' }
  },
  required: ['id', 'password', 'user', 'reset']
}



export class SetDepositLimitHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, user, daily, weekly, monthly, password, reset } = this.args

  
      if (!(await comparePassword(password, user.password))) throw new AppError(Errors.INCORRECT_PASSWORD)

      const userLimits = await getOne({ model: db.Limit, data: { userId: id } })

      if (reset) {
        if (daily && !(userLimits.dailyDepositExpiry && new Date(userLimits.dailyDepositExpiry) >= new Date())) {
          await userLimits.set({ dailyDepositLimit: null, dailyDepositExpiry: null, dailyDepositUpdatedAt: new Date() }).save()
        }
        if (weekly && !(userLimits.weeklyDepositExpiry && new Date(userLimits.weeklyDepositExpiry) >= new Date())) {
          await userLimits.set({ weeklyDepositLimit: null, weeklyDepositExpiry: null, weeklyDepositUpdatedAt: new Date() }).save()
        }
        if (monthly && !(userLimits.monthlyDepositExpiry && new Date(userLimits.monthlyDepositExpiry) >= new Date())) {
          await userLimits.set({ monthlyDepositLimit: null, monthlyDepositExpiry: null, monthlyDepositUpdatedAt: new Date() }).save()
        }

        return { reset: true, limit: userLimits }
      } else {
        const updatedData = {}
        const limitErrors = []

        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 1)

        if (daily) {
          if (userLimits.dailyDepositLimit && userLimits.dailyDepositLimit <= daily && new Date(userLimits.dailyDepositExpiry) >= new Date()) {
            limitErrors.push(`Cannot update Daily limit till ${userLimits.dailyDepositExpiry}`)
          } else {
            updatedData.dailyDepositLimit = daily
            updatedData.dailyDepositExpiry = expiry
            updatedData.dailyDepositUpdatedAt = new Date()
          }
        }
        if (weekly) {
          if (userLimits.weeklyDepositLimit && userLimits.weeklyDepositLimit <= weekly && new Date(userLimits.weeklyDepositExpiry) >= new Date()) {
            limitErrors.push(`Cannot update weekly limit till ${userLimits.weeklyDepositExpiry}`)
          } else {
            updatedData.weeklyDepositLimit = weekly
            updatedData.weeklyDepositExpiry = expiry
            updatedData.weeklyDepositUpdatedAt = new Date()
          }
        }
        if (monthly) {
          if (userLimits.monthlyDepositLimit && userLimits.monthlyDepositLimit <= monthly && new Date(userLimits.monthlyDepositExpiry) >= new Date()) {
            limitErrors.push(`Cannot update monthly limit till ${userLimits.monthlyDepositExpiry}`)
          } else {
            updatedData.monthlyDepositLimit = monthly
            updatedData.monthlyDepositExpiry = expiry
            updatedData.monthlyDepositUpdatedAt = new Date()
          }
        }

        await userLimits.set(updatedData).save()

        if (limitErrors.length === 0) return { limit: userLimits, message: SUCCESS_MSG.UPDATE_SUCCESS }
        return { limit: userLimits, limitErrors }
      }
   
  }
}
