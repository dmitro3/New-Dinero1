import axios from 'axios'
import bcrypt from 'bcrypt'
import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'
import geoip from 'geoip-lite'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { Op, Sequelize } from 'sequelize'
import config from '../configs/app.config'
import db from '../db/models'
import { getAll, getOne, updateEntity } from '../services/helper/crud'
import { BONUS_TYPE, OK, PAYMENT_PROVIDER, SUCCESS, TRANSACTION_STATUS, TRANSACTION_TYPE, UPLOAD_DOCUMENT_SIZE, UPLOAD_FILE_SIZE } from './constant'
// import _ from 'lodash'
import ObsClient from 'esdk-obs-nodejs'
import { Readable } from 'stream'
import { v4 as uuid } from 'uuid'
import Logger from '../libs/logger'
import WalletEmitter from '../socket-resources/emmitter/wallet.emmitter'
import { ERROR_MSG } from './errors'

export const encryptPassword = (plainPassword) => {
  if (!plainPassword) {
    throw new Error("Password cannot be empty");
  }

  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
};


export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;

  return bcrypt.compare(plainPassword, hashedPassword);
};
;

export const signAccessToken = async ({ name, email, id, uuid, sessionTime }) => {
  const payload = { email, id, name, uuid }
  let expiresIn

  if (sessionTime) {
    expiresIn = `${sessionTime}h`
  } else {
    expiresIn = config.get('jwt.tokenExpiry')
  }

  const jwtToken = jwt.sign(payload,
    config.get('jwt.tokenSecret'),
    { expiresIn }
  )

  return jwtToken
}



export const pageValidation = (pageNo, limit, maxSize = 200) => {
  const pageAsNumber = Number.parseInt(pageNo)
  const sizeAsNumber = Number.parseInt(limit)
  let page = 1
  let size = 15

  if ((Number.isNaN(pageAsNumber) || pageAsNumber < 0) ||
    (Number.isNaN(sizeAsNumber) || sizeAsNumber < 0 || sizeAsNumber > maxSize)) {
    return { page, size }
  }

  size = sizeAsNumber
  page = pageAsNumber

  return { page, size }
}

export const keyFilter = (globalRegistration, user) => {
  const keysArray = Object.keys(globalRegistration).filter(key => globalRegistration[key] === 2 || globalRegistration[key] === 1)

  Object.keys(user).forEach(function (key) {
    if (!(keysArray.includes(key))) delete user[key]
  })

  return user
}

export const validateFile = (res, file) => {
  if (file && file.size > UPLOAD_FILE_SIZE) {
    return 'File size too large'
  }

  if (file && file.mimetype) {
    const fileType = file.mimetype.split('/')[1]
    const supportedFileType = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml']

    if (!supportedFileType.includes(fileType)) {
      return 'File type not supported'
    }
  }

  return OK
}

export const validateDocument = (res, files) => {
  if (!files || files?.length < 1) return 'Documents not found'
  const documentCount = files.length

  for (let document = 0; document < documentCount; document++) {
    if (files[document] && files[document].size > UPLOAD_DOCUMENT_SIZE) {
      return 'File size too large'
    }

    if (files[document] && files[document].mimetype) {
      const fileType = files[document].mimetype.split('/')[1]
      const supportedFileType = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'pdf', 'ott', 'odt']

      if (!supportedFileType.includes(fileType)) {
        return 'File type not supported'
      }
    }
  }

  return OK
}

export const getUserRegistration = async () => {
  const dataArray = ['userId', 'isEmailVerified', 'isActive', 'phone']
  const subscriptions = []

  // const globalRegistration = await getOne({
  //   model: db.GlobalSetting,
  //   data: { key: 'GLOBAL_REGISTRATION' },
  //   raw: true,
  //   attributes: ['value']
  // })

  //   _.forEach(Object.keys(globalRegistration.value), (key) => {
  //     if (globalRegistration.value[key] === 2 || globalRegistration.value[key] === 1) {
  //       if (key !== 'confirmPassword' && key !== 'password' && key !== 'preferredLanguage') {
  //         if (key !== 'newsLetter' && key !== 'sms') dataArray.push(key)
  //         else subscriptions.push(key)
  //     }
  //   }
  // })
  if (dataArray.includes('phone')) dataArray.push('phoneCode')
  if (dataArray.includes('address')) {
    dataArray.push('zipCode')
    dataArray.push('city')
  }

  return { dataArray, subscriptions }
}

export const updateUser = async (detail, req) => {
  await updateEntity({
    model: db.User,
    values: { userId: detail.userId },
    data: {
      signInCount: detail.signInCount + 1,
      signInIp: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress,
      lastLoginDate: new Date()
    }
  })
  // const primaryAmount = await getPrimaryCurrencyAmount({ currencyCode: detail?.currencyCode })
  detail = { ...detail, ipAddress: req.body.ipAddress }
}

export const getRequestIP = (req) => {
  if (!req) return '0.0.0.0';

  const headers = req.headers || {};
  let ipAddress =
    (headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection?.remoteAddress?.split(':ffff:')[1] ||
    req.socket?.remoteAddress ||
    req.ip ||
    '0.0.0.0';

  // Normalize localhost IPv6
  if (ipAddress === '::1') ipAddress = '1.1.1.1';

  return ipAddress;
};


export const userId = (req) => {
  let token, response

  if (req && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1]

    const encodedPayload = token.split('.')[1]
    const payload = Buffer.from(encodedPayload, 'base64')

    response = JSON.parse(payload.toString())
    if (response.role) return null
    return response.id
  }
  return null
}

export const filterByName = (query, name) => {
  name = name.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = { ...query, gameIdentifier: { [Op.iLike]: `%${name}%` } }

  return query
}
export const filterByGroupName = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = { ...query, name: { [Op.iLike]: `%${search}%` } }

  return query
}

export const filterByDescription = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = { ...query, description: { [Op.iLike]: `%${search}%` } }

  return query
}
export const filterByMessage = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = { ...query, message: { [Op.iLike]: `%${search}%` } }

  return query
}

export const filterByNameEmail = (query, search, model) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  let innerQuery

  if (model === 'User') innerQuery = { username: { [Op.iLike]: `%${search}%` } }

  query = {
    ...query,
    [Op.or]: [
      Sequelize.where(Sequelize.fn('concat', Sequelize.col(`${model}.first_name`), ' ', Sequelize.col(`${model}.last_name`)), {
        [Op.iLike]: `%${search}%`
      }),
      { email: { [Op.iLike]: `%${search}%` } }, innerQuery]
  }

  return query
}

export const filterByDate = (query, startDate = null, endDate = null) => {
  endDate = endDate || Date.now()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '>=', new Date(startDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '<=', new Date(endDate))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '<=', new Date(endDate))
      ]
    }
  }

  return query
}

export const decodeCredential = (data, object = false) => {
  if (!object) return CryptoJS.AES.decrypt(data, config.get('credentialsEncryptionKey')).toString(CryptoJS.enc.Utf8)

  const credentials = []

  data.forEach((credential) => {
    credential.value = CryptoJS.AES.decrypt(data, config.get('credentialsEncryptionKey')).toString(CryptoJS.enc.Utf8)
    credentials.push(credential)
  })

  return credentials
}

export const getLocation = async (ipAddress) => {
  let country = 'IN'
  let ip = await geoip.lookup(ipAddress)

  if (!ip) {
    ip = await axios.get('http://ip-api.com/json/' + `${ipAddress}`)

    if (ip.data.status === SUCCESS) country = ip.data.countryCode
  } else {
    country = ip?.country
  }

  const location = await getOne({
    model: db.Country,
    data: { code: country },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })

  return location
}

export const getPrimaryCurrencyAmount = async ({ currencyCode, amount }) => {
  let primaryCurrencyRate, secondaryCurrencyRate

  const currencyDetail = await getAll({
    model: db.Currency,
    data: { [Op.or]: { code: currencyCode, isPrimary: true } },
    attributes: ['exchangeRate', 'code']
  })

  if (currencyDetail.length === 1) {
    primaryCurrencyRate = currencyDetail[0].exchangeRate
    secondaryCurrencyRate = currencyDetail[0].exchangeRate
  } else {
    if (currencyDetail[0].code === currencyCode) {
      primaryCurrencyRate = currencyDetail[1].exchangeRate
      secondaryCurrencyRate = currencyDetail[0].exchangeRate
    } else {
      primaryCurrencyRate = currencyDetail[0].exchangeRate
      secondaryCurrencyRate = currencyDetail[1].exchangeRate
    }
  }

  const conversionRate = primaryCurrencyRate / parseFloat(secondaryCurrencyRate)
  amount = Math.abs((amount * conversionRate).toFixed(2))
  return { amount, conversionRate }
}

export const getGlobalRegistration = async (transaction) => {
  let globalRegistration = await getOne({
    model: db.GlobalSetting,
    data: { key: 'GLOBAL_REGISTRATION' },
    raw: true,
    attributes: ['value'],
    transaction
  })

  globalRegistration = globalRegistration.value
  return globalRegistration
}

export const getOtherCurrenciesAmount = async ({ amount, currencyCode }) => {
  const currencies = await getAll({
    model: db.Currency,
    attributes: ['code', 'exchangeRate'],
    raw: true
  })

  const sourceExchangeRate = await currencies.find(currency => currency.code === currencyCode)
  const amountInOtherCurrencies = {}

  currencies.forEach(currency => {
    const conversionRate = parseFloat(sourceExchangeRate.exchangeRate) / currency.exchangeRate
    amountInOtherCurrencies[currency.code] = Math.abs((amount * conversionRate).toFixed(2))
  })

  return amountInOtherCurrencies
}

export const liveLoginUser = async (msg) => {
  if (!msg?.userId) return
  if (!msg?.deviceType) msg.deviceType = 'desktop'

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ['userId', 'loggedIn', 'deviceType']
  })

  await user.set({ loggedIn: user.loggedIn + 1, deviceType: msg.deviceType }).save()
}

export const setLoyaltySequence = (levels) => {
  const returnList = []
  levels.forEach(level => {
    returnList.push({
      level: level.level,
      startPoint: level.startPoint,
      endPoint: level.endPoint,
      cashback_multiplier: level.cashback_multiplier
    })
  })
  return returnList
}

export const liveLogoutUser = async (msg) => {
  if (!msg?.userId) return

  const user = await getOne({
    model: db.User,
    data: { userId: msg.userId },
    attributes: ['userId', 'loggedIn']
  })

  if (user.loggedIn > 0) await user.set({ loggedIn: user.loggedIn - 1 }).save()
}

export const getLevelDetails = ({ loyaltyLevels, currentPoint }) => {
  let startPoint, endPoint
  let level = 1

  const lastLevel = loyaltyLevels[loyaltyLevels.length - 1]
  const firstLevel = loyaltyLevels[0]

  if (lastLevel.endPoint <= currentPoint) {
    return { startPoint: 0, endPoint: 0, maxLevel: true, level: lastLevel.level }
  }

  if (currentPoint === 0) {
    return { startPoint: firstLevel.startPoint, endPoint: firstLevel.endPoint, maxLevel: false, level: firstLevel.level }
  }

  loyaltyLevels.forEach(loyaltyLevel => {
    if (loyaltyLevel.startPoint <= currentPoint && loyaltyLevel.endPoint > currentPoint) {
      startPoint = loyaltyLevel.startPoint
      endPoint = loyaltyLevel.endPoint
      level = loyaltyLevel.level
    }
  })

  return { startPoint, endPoint, maxLevel: false, level }
}

export const filterByGameSubCategory = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = {
    ...query,
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } }
    ]
  }

  return query
}

export const getDay = () => {
  const options = { weekday: 'long' }
  const today = new Intl.DateTimeFormat('en-US', options).format(new Date(Date.now()))

  return today
}

export const filterByDateCreatedAt = (query, startDate = null, endDate = null, modelName) => {
  endDate = endDate || Date.now()

  if (startDate) {
    query = {
      ...query,
      [Op.and]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '>=', new Date(startDate)),
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '<=', new Date(endDate))
      ]
    }
  } else {
    query = {
      ...query,
      [Op.or]: [
        Sequelize.where(Sequelize.fn('date', Sequelize.col(`${modelName}.created_at`)), '<=', new Date(endDate))
      ]
    }
  }

  return query
}

export const getDetails = async ({ currency, country }) => {
  let currencyId, countryName

  if (currency) {
    const details = await getOne({ model: db.Currency, data: { code: currency }, attributes: ['currencyId'] })
    currencyId = details.currencyId
  }

  if (country) {
    const details = await getOne({ model: db.Country, data: { code: country }, attributes: ['name'] })
    countryName = details.name
  }

  return { currencyId, countryName }
}

export const getAllPortalUserIds = async (email, days) => {
  const userIds = []

  const accounts = await getAll({
    model: db.User,
    data: { email },
    attributes: ['userId', 'currencyCode'],
    raw: true
  })

  for (const user of accounts) {
    userIds.push(user.userId)
  }

  return userIds
}

export const filterByGameName = (query, search) => {
  search = search.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
  query = { ...query, name: { [Op.iLike]: `%${search}%` } }

  return query
}

// Func to create hash for PP
export const calculateHash = (parameters, secretKey) => {
  delete parameters.hash

  const sortedParameters = Object.keys(parameters)
    .sort()
    .map(key => `${key}=${parameters[key]}`)
    .join('&')

  const dataToHash = `${sortedParameters}${secretKey}`
  const hash = md5(dataToHash)

  return hash
}

export const encodeToBase64 = input => Buffer.from(input).toString('base64')

export const isOver18 = age => {
  const newDate = new Date(age)
  newDate.setFullYear(new Date(age).getFullYear() + 18)
  return newDate > new Date()
}

export const addReferralAmountToUser = async (IdRef, referralAmount, currencyId) => {
  try {
    let addAmount = referralAmount.value.amount
    const userWallet = await db.Wallet.findOne({
      where: { ownerId: IdRef, currencyId },
      include: {
        model: db.Currency,
        as: 'currency',
        attributes: ['code']
      }
    })
    addAmount = parseFloat(addAmount)
    await userWallet.set({ amount: userWallet.amount + addAmount }).save()

    const transactionDetails = {
      targetId: IdRef,
      walletId: userWallet.walletId,
      amount: addAmount,
      currencyCode: userWallet.currency.code,
      beforeBalance: userWallet.amount,
      paymentProvider: PAYMENT_PROVIDER.OFFLINE,
      transactionId: uuid(),
      amountType: 0,
      transactionType: TRANSACTION_TYPE.BONUS_REFERRAL,
      status: TRANSACTION_STATUS.SUCCESS,
      transactionDateTime: (new Date()).toISOString()
    }
    await db.TransactionBanking.create({ ...transactionDetails })
  } catch (error) {
    console.log(error)
    this.addError('addReferralAmountToUserError', error)
  }
}

export const socketIOEmitter = async (playerId, currencyId, coin) => {
  try {
    const amount = await db.Wallet.findOne({
      where: { ownerId: playerId, currencyId: currencyId }
    })

    const data = {
      amount: amount.amount, nonCashAmount: amount.nonCashAmount, currencyCode: coin
    }

    await WalletEmitter.emitUserWalletBalance(data, playerId)
  } catch (error) {
    Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
  }
}

export const prepareWheelConfiguration = async (userId, wheelConfigData) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0)
  const NOW = new Date()
  const result = await db.CasinoTransaction.findAll({
    attributes: [
      'user_id',
      [Sequelize.literal("more_details ->> 'wheelDivisionId'"), 'wheelDivisionId'],
      [Sequelize.fn('COUNT', Sequelize.literal('*')), 'wheelDivisionIdCount']
    ],
    where: {
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW
      },
      userId: userId,
      actionType: BONUS_TYPE.SPIN_WHEEL
    },
    logging: true,
    group: ['user_id', 'wheelDivisionId'],
    raw: true
  })

  // Transform the result into the desired format
  const wheelDivisionCount = result.reduce((accumulator, entry) => {
    const { wheelDivisionId, wheelDivisionIdCount } = entry
    accumulator[wheelDivisionId] = wheelDivisionIdCount
    return accumulator
  }, {})

  wheelConfigData.forEach((wheelData, index) => {
    if (!isNull(wheelData.playerLimit)) {
      if (!wheelData.playerLimit) {
        wheelConfigData[index].isAllow = false
        return false
      }
      const data = wheelDivisionCount[wheelData.wheelDivisionId]
      if (data && Number(data) >= Number(wheelData.playerLimit)) {
        wheelConfigData[index].isAllow = false
      }
    }
  })
  return wheelConfigData
}

export const prepareWageringBonus = async ({ userBonusObj, transaction }) => {
  let isBonusActive
  const wageringData = await getOne({
    model: db.BonusConfiguration,
    data: { bonusType: userBonusObj.bonusType },
    attributes: ['wageringMultiplier', 'wageringReachLimit', 'priority']
  })
  if (+userBonusObj.scAmount !== 0) {
    isBonusActive = await getOne({
      model: db.UserBonus,
      data: {
        status: STATUS_VALUE.ACTIVE,
        userId: userBonusObj.userId
      }
    })

    /** If any bonus active then next bonus will be on pending state otherwise it will be on active state */
    if (isBonusActive) {
      userBonusObj.status = STATUS_VALUE.PENDING
    } else {
      userBonusObj.status = STATUS_VALUE.ACTIVE

      const wageringExpDate = new Date()
      wageringExpDate.setHours(wageringExpDate.getHours() + +wageringData?.wageringReachLimit)
      userBonusObj.wageringActivationTime = wageringExpDate
      userBonusObj.moreDetails = { bonusClaimed: true, wageringMultiplier: wageringData?.wageringMultiplier }
    }

    userBonusObj.amountToWager = userBonusObj.scAmount * +wageringData?.wageringMultiplier
    userBonusObj.wageringTime = +wageringData?.wageringReachLimit
  } else {
    userBonusObj.status = BONUS_STATUS.CLAIMED
    isBonusActive = false
  }

  userBonusObj.priority = +wageringData?.priority

  const isCreated = await createNewEntity({
    model: db.UserBonus,
    data: userBonusObj,
    transaction
  })

  return { isCreated, isAllowed: !isBonusActive }
}
