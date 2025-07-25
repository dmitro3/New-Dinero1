import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { updateEntity } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
import { BREAK_TYPE, SELF_EXCLUSION_TYPE } from '@src/utils/constant'
import { comparePassword, getAllPortalUserIds } from '@src/utils/common'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    user: { type: 'object' },
    type: { enum: ['TAKE_A_BREAK', 'SELF_EXCLUSION'] },
    days: { type: ['number', 'null'] },
    portal: { enum: ['current', 'all'] },
    password: { type: 'string' }
  },
  required: ['id', 'password', 'user', 'type', 'portal']
}



export class SetDisableUntilHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    let { id, user, type, days, password, portal } = this.args
    const disableUntil = user.selfExclusion
    let timeStamp, isSelfExclusionPermanent

  
      if (!(await comparePassword(password, user.password))) throw new AppError(Errors.INCORRECT_PASSWORD)

      if (disableUntil && new Date(disableUntil) >= new Date()) throw new AppError(Errors.USER_DISABLE_UNTIL_ERROR_TYPE)

      if (!type) type = BREAK_TYPE.TAKE_A_BREAK

      if (type === BREAK_TYPE.TAKE_A_BREAK) {
        if (days <= 0 || days > 30) throw new AppError(Errors.TAKE_ABREAK_DAY)

        const now = new Date()
        now.setDate(now.getDate() + days)
        timeStamp = now
      } else if (type === BREAK_TYPE.SELF_EXCLUSION) {
        if (days === -1) {
          timeStamp = null
          isSelfExclusionPermanent = true
        } else {
          const now = new Date()
          now.setDate(now.getDate() + days)
          timeStamp = now
          isSelfExclusionPermanent = false
        }
      }

      let updateDisableUntil

      if (type === BREAK_TYPE.TAKE_A_BREAK) {
        updateDisableUntil = await updateEntity({
          model: db.User,
          data: { selfExclusion: timeStamp, selfExclusionUpdatedAt: new Date() },
          values: { userId: id }
        })
      } else if (type === BREAK_TYPE.SELF_EXCLUSION && portal === SELF_EXCLUSION_TYPE.CURRENT) {
        updateDisableUntil = await updateEntity({
          model: db.Limit,
          data: { selfExclusion: timeStamp, isSelfExclusionPermanent, selfExclusionType: portal, selfExclusionUpdatedAt: new Date() },
          values: { userId: id }
        })
      } else if (type === BREAK_TYPE.SELF_EXCLUSION && portal === SELF_EXCLUSION_TYPE.ALL) {
        const allPortalUserIds = await getAllPortalUserIds(user.email, days)

        updateDisableUntil = await updateEntity({
          model: db.Limit,
          data: { selfExclusion: timeStamp, isSelfExclusionPermanent, selfExclusionType: portal, selfExclusionUpdatedAt: new Date() },
          values: { userId: allPortalUserIds }
        })
      }

      return { updateDisableUntil, message: SUCCESS_MSG.UPDATE_SUCCESS }
   
  }
}
