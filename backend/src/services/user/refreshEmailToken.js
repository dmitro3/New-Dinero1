import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import Jwt from 'jsonwebtoken'
import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import config from '@src/configs/app.config'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'
import { getOne, updateEntity } from '../helper/crud'
import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'
import { sendEmail } from '../helper/email'

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' }
  },
  required: ['email']
}



export class RefreshEmailTokenHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    let { email } = this.args
    const transaction = this.context.sequelizeTransaction

  
      email = email.toLowerCase()

      const user = await getOne({
        model: db.User,
        data: { email },
        attributes: ['userId', 'uniqueId', 'isEmailVerified', 'email', 'locale', 'username'],
        transaction
      })

      if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
      if (user.isEmailVerified) throw new AppError(Errors.EMAIL_ALREADY_VERIFIED)

      const emailToken = Jwt.sign({
        userId: user.uniqueId
      }, config.get('jwt.emailTokenKey'), { expiresIn: config.get('jwt.emailTokenExpiry') })

      const emailVerificationSent = await sendEmail({
        user: user,
        emailTemplate: EMAIL_TEMPLATE_TYPES.EMAIL_VERIFICATION,
        data: {
          link: `${config.get('app.userFrontendUrl')}/verify-email?emailToken=${emailToken}`,
          subject: EMAIL_SUBJECTS[user.locale].verification || EMAIL_SUBJECTS.EN.verification
        },
        message: SUCCESS_MSG. EMAIL_SENT
      })

      if (emailVerificationSent.message.status === 200) {
        await updateEntity({ model: db.User, data: { emailToken }, values: { userId: user.userId }, transaction })
      }

      return { emailVerificationSent }
   
  }
}
