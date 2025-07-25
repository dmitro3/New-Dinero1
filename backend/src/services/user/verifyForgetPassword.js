import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { BaseHandler } from '@src/libs/logicBase'
import { encryptPassword } from '@src/utils/common'
import { comparePassword } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import Jwt from 'jsonwebtoken'


export class VerifyForgetPasswordHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    let { newPasswordKey, password } = this.args
    const transaction = this.context.sequelizeTransaction

    let newPasswordKeyData
    newPasswordKeyData = Jwt.verify(newPasswordKey, config.get('jwt.resetPasswordKey'))

    if (!newPasswordKeyData) throw new AppError(Errors.RESET_PASSWORD_TOKEN)
    // if (!password && !uuid) return { tokenValid: true, uuid: newPasswordKeyData.userId, newPasswordKey, message: 'Reset your password' }
    // if (!password) return { tokenValid: true, uuid: newPasswordKeyData.userId, newPasswordKey, message: 'Reset your password' }
    if (!password) throw new AppError(Errors.PASSWORD_NOT_FOUND_ERROR)

    const userData = await db.User.findOne({
      where: { userId: newPasswordKeyData.userId },
      include: {
        model: db.UserDetails,
        as: 'userDetails',
        where: { newPasswordKey },
        required: true
      },
      transaction
    })

    if (!userData) throw new AppError(Errors.USER_NOT_EXISTS)
    if (!userData?.userDetails) throw new AppError(Errors.RESET_PASSWORD_TOKEN)
    // if (uuid !== newPasswordKeyData.userId) throw new AppError(Errors.RESET_PASSWORD_TOKEN)

    const isPasswordSame = await comparePassword(password, userData.password)
    if (isPasswordSame) {
      throw new AppError(Errors.SAME_PASSWORD_ERROR)
    }

    await Promise.all([
      db.User.update(
        { password: encryptPassword(password) },
        { where: { userId: newPasswordKeyData.userId }, transaction }
      ),
      db.UserDetails.update(
        { newPasswordKey: '' },
        { where: { userId: userData.userId }, transaction }
      )
    ])
    
    return { success: true, message: SUCCESS_MSG.PASSWORD_RESET }

  }
}