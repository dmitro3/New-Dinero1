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



export class SetLossLimitHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, user, daily, weekly, monthly, password, reset } = this.args

  
      if (!(await comparePassword(password, user.password))) throw new AppError(Errors.INCORRECT_PASSWORD)

      const userLimits = await getOne({ model: db.Limit, data: { userId: id } })

      if (reset) {
        if (daily && !(userLimits.dailyLossExpiry && new Date(userLimits.dailyLossExpiry) >= new Date())) {
          await userLimits.set({ dailyLossLimit: null, dailyLossExpiry: null, dailyLossUpdatedAt: new Date() }).save()
        }
        if (weekly && !(userLimits.weeklyLossExpiry && new Date(userLimits.weeklyLossExpiry) >= new Date())) {
          await userLimits.set({ weeklyLossLimit: null, weeklyLossExpiry: null, weeklyLossUpdatedAt: new Date() }).save()
        }
        if (monthly && !(userLimits.monthlyLossExpiry && new Date(userLimits.monthlyLossExpiry) >= new Date())) {
          await userLimits.set({ monthlyLossLimit: null, monthlyLossExpiry: null, monthlyLossUpdatedAt: new Date() }).save()
        }

        return { reset: true, limit: userLimits }
      } else {
        const updatedData = {}
        const limitErrors = []

        const expiry = new Date()
        expiry.setDate(expiry.getDate() + 1)

        if (daily) {
          if (userLimits.dailyLossLimit && userLimits.dailyLossLimit <= daily && new Date(userLimits.dailyLossExpiry) >= new Date()) {
            limitErrors.push(`Cannot update Daily limit till ${userLimits.dailyLossExpiry}`)
          } else {
            updatedData.dailyLossLimit = daily
            updatedData.dailyLossExpiry = expiry
            updatedData.dailyLossUpdatedAt = new Date()
          }
        }
        if (weekly) {
          if (userLimits.weeklyLossLimit && userLimits.weeklyLossLimit <= weekly && new Date(userLimits.weeklyLossExpiry) >= new Date()) {
            limitErrors.push(`Cannot update weekly limit till ${userLimits.weeklyLossExpiry}`)
          } else {
            updatedData.weeklyLossLimit = weekly
            updatedData.weeklyLossExpiry = expiry
            updatedData.weeklyLossUpdatedAt = new Date()
          }
        }
        if (monthly) {
          if (userLimits.monthlyLossLimit && userLimits.monthlyLossLimit <= monthly && new Date(userLimits.monthlyLossExpiry) >= new Date()) {
            limitErrors.push(`Cannot update monthly limit till ${userLimits.monthlyLossExpiry}`)
          } else {
            updatedData.monthlyLossLimit = monthly
            updatedData.monthlyLossExpiry = expiry
            updatedData.monthlyLossUpdatedAt = new Date()
          }
        }

        await userLimits.set(updatedData).save()

        if (limitErrors.length === 0) return { limit: userLimits, message: SUCCESS_MSG.UPDATE_SUCCESS }
        return { limit: userLimits, limitErrors }
      }
   
  }
}
