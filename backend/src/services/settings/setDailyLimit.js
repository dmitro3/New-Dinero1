import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { getOne } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
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



export class SetDailyLimitHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, user, daily, weekly, monthly, password, reset } = this.args

  
      if (!(await comparePassword(password, user.password))) throw new AppError(Errors.INCORRECT_PASSWORD)

      const userLimits = await getOne({ model: db.Limit, data: { userId: id } })

      if (reset) {
        if (daily && !(userLimits.dailyBetExpiry && new Date(userLimits.dailyBetExpiry) >= new Date())) {
          await userLimits.set({ dailyBetLimit: null, dailyBetExpiry: null, dailyBetUpdatedAt: new Date() }).save()
        }
        if (weekly && !(userLimits.weeklyBetExpiry && new Date(userLimits.weeklyBetExpiry) >= new Date())) {
          await userLimits.set({ weeklyBetLimit: null, weeklyBetExpiry: null, weeklyBetUpdatedAt: new Date() }).save()
        }
        if (monthly && !(userLimits.monthlyBetExpiry && new Date(userLimits.monthlyBetExpiry) >= new Date())) {
          await userLimits.set({ monthlyBetLimit: null, monthlyBetExpiry: null, monthlyBetUpdatedAt: new Date() }).save()
        }

        return { reset: true, limit: userLimits }
      } else {
        const updatedData = {}
        const limitErrors = []

        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 1)

        if (daily) {
          if (userLimits.dailyBetLimit && userLimits.dailyBetLimit <= daily && new Date(userLimits.dailyBetExpiry) >= new Date()) {
            limitErrors.push(`Cannot update Daily limit till ${userLimits.dailyBetExpiry}`)
          } else {
            updatedData.dailyBetLimit = daily
            updatedData.dailyBetExpiry = expiry
            updatedData.dailyBetUpdatedAt = new Date()
          }
        }
        if (weekly) {
          if (userLimits.weeklyBetLimit && userLimits.weeklyBetLimit <= weekly && new Date(userLimits.weeklyBetExpiry) >= new Date()) {
            limitErrors.push(`Cannot update weekly limit till ${userLimits.weeklyBetExpiry}`)
          } else {
            updatedData.weeklyBetLimit = weekly
            updatedData.weeklyBetExpiry = expiry
            updatedData.weeklyBetUpdatedAt = new Date()
          }
        }
        if (monthly) {
          if (userLimits.monthlyBetLimit && userLimits.monthlyBetLimit <= monthly && new Date(userLimits.monthlyBetExpiry) >= new Date()) {
            limitErrors.push(`Cannot update monthly limit till ${userLimits.monthlyBetExpiry}`)
          } else {
            updatedData.monthlyBetLimit = monthly
            updatedData.monthlyBetExpiry = expiry
            updatedData.monthlyBetUpdatedAt = new Date()
          }
        }

        await userLimits.set(updatedData).save()

        if (limitErrors.length === 0) return { limit: userLimits, message: SUCCESS_MSG.UPDATE_SUCCESS }
        return { limit: userLimits, limitErrors }
      }
   
  }
}
