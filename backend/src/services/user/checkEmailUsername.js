import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { getOne } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    username: {
      type: ['string', 'null']
    },
    email: {
      type: ['string', 'null']
    }
  }
}



export class CheckUniqueEmailUsername extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    let { email, username } = this.args

  
      if (email) {
        email = email.toLowerCase()
        const emailCheck = await getOne({
          model: db.User,
          data: { email },
          attributes: ['email']
        })

        if (emailCheck) throw new AppError(Errors.EMAIL_ALREADY_EXISTS)
      }

      if (username) {
        const usernameCheck = await getOne({
          model: db.User,
          data: { username },
          attributes: ['username']
        })

        if (usernameCheck) throw new AppError(Errors.USER_NAME_EXISTS)
      }

      return { checkUniqueConstraint: true, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
