import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    isGhostMode: { type: 'boolean' }
  },
  required: ['id','isGhostMode']
}



export class UpdateGhostMode extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id, isGhostMode } = this.args

  
      const userExist = await db.User.findOne({
        where: { userId: id },
        attributes: ['isGhostMode']
      })

      if(!userExist) throw new AppError(Errors.USER_NOT_EXISTS)

      await db.User.update({ isGhostMode: isGhostMode}, {
        where: { userId: id }
      })

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
   
  }
}
