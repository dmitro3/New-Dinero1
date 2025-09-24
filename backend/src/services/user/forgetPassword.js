import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import { Op } from 'sequelize'
import Jwt from 'jsonwebtoken'
import { serverDayjs } from '@src/libs/dayjs'
import ajv from '@src/libs/ajv'
import db from '@src/db/models'
import config from '@src/configs/app.config'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'
import { getOne, updateEntity } from '../helper/crud'
import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'
import {
  sendEmail,
  sendMailjetEmail,
  sendMailjetEmailResetPassword,
} from '../helper/email'

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    origin: { type: ['string', 'null'] },
  },
  required: ['email'],
}

export class ForgetPasswordHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    let { email, origin } = this.args
    const transaction = this.context.sequelizeTransaction

    const checkUserExist = await getOne({
      model: db.User,
      data: { [Op.or]: { email: email, username: email } },
      attributes: ['userId', 'email', 'isEmailVerified', 'locale', 'username'],
      // attributes: ['userId', 'email', 'isEmailVerified', 'username'],
      transaction,
    })
    if (!checkUserExist) throw new AppError(Errors.EMAIL_NOT_EXISTS)
    if (!checkUserExist.isEmailVerified)
      throw new AppError(Errors.EMAIL_NOT_VERIFIED)

    const newPasswordKey = Jwt.sign(
      {
        userId: checkUserExist.userId,
      },
      config.get('jwt.resetPasswordKey'),
      { expiresIn: config.get('jwt.emailTokenExpiry') }
    )

    if (!origin) origin = config.get('app.userFrontendUrl')

    const forgetPasswordEmailSent = await sendMailjetEmailResetPassword({
      user: checkUserExist,
      emailTemplate: EMAIL_TEMPLATE_TYPES.RESET_PASSWORD,
      data: {
        link: `${origin}/reset-password?newPasswordKey=${newPasswordKey}`,
        subject:
          (EMAIL_SUBJECTS[checkUserExist.locale] &&
            EMAIL_SUBJECTS[checkUserExist.locale].reset) ||
          EMAIL_SUBJECTS.EN.reset,
      },
      message: SUCCESS_MSG.RESET_PASSWORD_EMAIL,
    })

    if (forgetPasswordEmailSent === true) {
      await db.UserDetails.update(
        { newPasswordKey, newPasswordRequested: serverDayjs() },
        {
          where: { userId: checkUserExist.userId },
          transaction,
        }
      )
    }

    return { forgetPasswordEmailSent, message: SUCCESS_MSG.CREATE_SUCCESS }
  }
}
