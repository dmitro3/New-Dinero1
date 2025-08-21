import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { BaseHandler } from '@src/libs/logicBase'
import { comparePassword, encryptPassword } from '@src/utils/common'
import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'
import { SUCCESS_MSG } from '@src/utils/success'
import { sendMailjetEmail } from '../helper/email'

const schema = {
  type: 'object',
  properties: {
    password: { type: ['string', 'null'] },
    newPassword: { type: ['string', 'null'] },
    userId: { type: ['object', 'null'] }
  },
  required: ['newPassword', 'password', 'userId']
}

export class ChangePasswordHandler extends BaseHandler {
  get constraints() {
    return schema; // ✅ fix: was "constraints"
  }

  async run() {
    const { newPassword, password, userId } = this.args
    const transaction = this.dbTransaction

    const user = await db.User.findOne({
      where: { userId },
      attributes: ['userId', 'isEmailVerified', 'email', 'username', 'password'],
      transaction
    })
    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)

    // ✅ compare exact password (special chars included)
    if (!(await comparePassword(password, user.password))) {
      throw new AppError(Errors.WRONG_PASSWORD_ERROR)
    }

    // ✅ check if new password is same as old (hashed)
    if (await comparePassword(newPassword, user.password)) {
      throw new AppError(Errors.SAME_PASSWORD_ERROR)
    }

    // ✅ save new encrypted password
    await user.set({ password: encryptPassword(newPassword) }).save({ transaction })

    // ⚠️ safer: don't include raw password in emails
    await sendMailjetEmail({
      user,
      emailTemplate: EMAIL_TEMPLATE_TYPES.UPDATE_PASSWORD,
      data: {
        subject: EMAIL_SUBJECTS[user.locale]?.passwordUpdated || EMAIL_SUBJECTS.EN.passwordUpdated,
        body: EMAIL_TEMPLATE_TYPES.passwordUpdated
      },
      message: SUCCESS_MSG.EMAIL_SENT
    })

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
