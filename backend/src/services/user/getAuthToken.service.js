import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { createAccessToken } from '@src/helpers/authentication.helpers'
import { BaseHandler } from '@src/libs/logicBase'
import { comparePassword } from '@src/utils/common'

export class GetAuthTokenHandler extends BaseHandler {
   async run () {
    const { username, password } = this.args
    try {
      const user = await db.User.findOne({
        where: { username },
        attributes: ['userId', 'username', 'firstName', 'lastName', 'password', 'createdAt'],
        include: {
          model: db.Wallet,
          as: 'userWallet',
          attributes: ['balance', 'currencyCode']
        },
      })
      if (!user) throw new AppError(Errors.USER_NOT_EXISTS)
      if (!await comparePassword(password, user.password)) throw new AppError(Errors.WRONG_PASSWORD_ERROR)
      const accessToken = await createAccessToken(user)
      delete user.dataValues.password
      return { user, accessToken }
    } catch (error) {
      return this.handleError(error)
    }
  }
}
