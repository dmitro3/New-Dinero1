import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { BaseHandler } from '@src/libs/logicBase'
import { encryptPassword } from '@src/utils/common'
import { SUCCESS_MSG } from '@src/utils/success'
import jwt from 'jsonwebtoken'
import { PragmaticCreatePlayerHandler } from '../casino'
import { createNewEntity, getAll, getOne, updateEntity } from '../helper/crud'



export class UserSocialSignUpHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    let kycStatus
    let {
      firstName, lastName, email, password, phone, phoneCode, gender, dateOfBirth,
      username, countryCode, signInType
    } = this.args
    const transaction = await db.sequelize.transaction()


    email = email.toLowerCase()

    const checkUserExist = await getOne({
      model: db.User,
      data: { email },
      attributes: ['email'],
      transaction: transaction
    })

    if (checkUserExist && checkUserExist.email === email) return { checkUserExist, message: SUCCESS_MSG.CREATE_SUCCESS }

    if (username) {
      const usernameCheck = await getOne({ model: db.User, data: { username }, attributes: ['username'], transaction: transaction })
      if (usernameCheck) throw new AppError(Errors.USER_NAME_EXISTS)
    }
    const newUser = {
      firstName,
      lastName,
      email,
      password: encryptPassword(password),
      phone,
      phoneCode,
      gender,
      currencyCode: 'IDR',
      dateOfBirth,
      username,
      countryCode,
      signInType
    }

    // const globalConfig = await getOne({
    //   model: db.GlobalSetting,
    //   data: { key: 'SITE_INFORMATION' },
    //   transaction: transaction
    // })

    const currencies = (await getAll({
      model: db.Currency,
      data: { isActive: true },
      attributes: ['currencyId']
    })).map((obj) => { return obj.currencyId })

    const walletObjects = currencies.map(currencyId => ({
      currencyId: currencyId,
      amount: 0,
      nonCashAmount: 0,
      winningAmount: 0
    }))

    const createUser = await createNewEntity({
      model: db.User,
      data: {
        ...newUser,
        isEmailVerified: true,
        kycStatus,
        locale: 'EN',
        userWallets: walletObjects,
        userDetails: {
          disableReason: 'NO'
        }
      },
      include: [
        {
          model: db.Wallet,
          as: 'userWallets',
          include: {
            model: db.Currency,
            as: 'currency',
            attributes: ['code', 'currencyId']
          }
        }, {
          model: db.UserDetails,
          as: 'userDetails',
          attributes: ['bannerText']
        }
      ],
      transaction: transaction
    })

    delete createUser.password
    const origin = config.get('app.userFrontendUrl')

    await createNewEntity({
      model: db.Limit,
      data: { userId: createUser.userId },
      transaction: transaction
    })

    await transaction.commit()

    const emailToken = jwt.sign({ userId: createUser.uniqueId }, config.get('jwt.emailTokenKey'), { expiresIn: config.get('jwt.emailTokenExpiry') })

    // createUser.emailVerificationSent =  await sendEmail({
    //   user: createUser,
    //   emailTemplate: EMAIL_TEMPLATE_TYPES.EMAIL_VERIFICATION,
    //   data: {
    //     link: `${origin}/verify-email?emailToken=${emailToken}`,
    //     subject: EMAIL_SUBJECTS[createUser.locale].verification || EMAIL_SUBJECTS.EN.verification
    //   },
    //   message: SUCCESS_MSG.EMAIL_SENT
    // })

    // if (createUser.emailVerificationSent.message.status === 200) {
    // }

    createUser.emailToken = emailToken

    await updateEntity({
      model: db.User,
      data: { emailToken },
      values: { userId: createUser.userId }
    })
    // create player on PP system
    await PragmaticCreatePlayerHandler.execute({ userId: createUser.userId })

    return { createUser, message: SUCCESS_MSG.CREATE_SUCCESS }
  }
}

