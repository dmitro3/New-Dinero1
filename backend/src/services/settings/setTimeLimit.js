import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import ajv from '@src/libs/ajv'
import db from '@src/db/models'
import { getOne } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
import { comparePassword, signAccessToken } from '@src/utils/common'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    user: { type: 'object' },
    timeLimit: { type: 'number' },
    reset: { type: 'boolean' },
    password: { type: 'string' }
  },
  required: ['id', 'password', 'user', 'timeLimit', 'reset']
}



export class SetTimeLimitHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, user, timeLimit, password, reset } = this.args

  
      if (!(await comparePassword(password, user.password))) throw new AppError(Errors.INCORRECT_PASSWORD)

      const userLimits = await getOne({ model: db.Limit, data: { userId: id } })

      if (userLimits.timeLimit && new Date(userLimits.timeLimitExpiry) >= new Date()) {
        throw new AppError(Errors.INVALID_ACTION)
      }
      if (reset) {
        await userLimits.set({ timeLimit: null, timeLimitExpiry: null, timeLimitUpdatedAt: new Date() }).save()
        return { reset: true, limit: userLimits }
      }

      if (timeLimit > 24 || timeLimit < 1) throw new AppError(Errors.SESSION_TIME_LIMIT)

      const now = new Date()
      now.setDate(now.getDate() + 1)

      await userLimits.set({ timeLimit, timeLimitExpiry: now, timeLimitUpdatedAt: new Date() }).save()

      const accessToken = await signAccessToken({
        id,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        sessionTime: timeLimit
      })

      return { limit: userLimits, accessToken, message: SUCCESS_MSG.UPDATE_SUCCESS }
   
  }
}
