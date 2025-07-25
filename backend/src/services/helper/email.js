import sgMail from '@sendgrid/mail'
import getSymbolFromCurrency from 'currency-symbol-map'
import mailjet from 'node-mailjet'

import db from '@src/db/models'
import { getOne } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { decodeCredential } from '@src/utils/common'
import { EMAIL_TEMPLATE_PRIMARY_STATUS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'
import Logger from '@src/libs/logger'
import config from '@src/configs/app.config'
import formData from 'form-data'
import Mailgun from 'mailgun.js'

export const sendMail = async ({ user, credentials, subject, successMsg, dynamicEmail, senderName }) => {
  sgMail.setApiKey(credentials.apiKey)

  const msg = {
    to: {
      Email: user.email,
      Name: user.username
    },
    from: {
      Email: credentials.apiEmail,
      Name: senderName
    },
    subject,
    html: dynamicEmail
  }

  try {
    await sgMail.send(msg)
    return { success: true, message: successMsg }
  } catch (err) {
    return { success: false, message: 'Unable to send email.' }
  }
}

export const sendDynamicMail = async ({ user, credentials, subject, successMsg, dynamicEmail, senderEmail, senderName }) => {
  const sendEmailObj = {
    from: {
      Email: senderEmail || 'spatankar@grepruby.io',
      Name: senderName || 'GS Casino'
    },
    To: [
      {
        Email: user.email,
        Name: user.username
      }
    ],
    Subject: subject || 'Test Email',
    HTMLPart: dynamicEmail
  }

  const mailjetEmail = mailjet.apiConnect(config.get('email.mailjetApiKey'), config.get('email.mailjetSecretKey'))

  try {
    const request = await mailjetEmail
      .post('send', { version: 'v3.1' })
      .request({ Messages: [sendEmailObj] })

    if (request.response.status === 200) return { success: true, code: request.response.status, message: successMsg }
    else return { success: false, code: request.response.status }
  } catch (error) {
    Logger.error('Email', { message: 'Mailjet Error: Failed to send mail', exception: error })
    return { success: false, code: error?.code }
  }
}

export const getSendGridCredentials = async ({ transaction }) => {
  const credentials = {}

  const sendgridCredentials = await getOne({
    model: db.GlobalSetting,
    data: { key: 'SENDGRID' },
    attributes: ['value'],
    raw: true,
    transaction
  })

  Object.entries(sendgridCredentials.value).forEach(([key, value]) => {
    if (key === 'SENDGRID_API_KEY') credentials.apiKey = decodeCredential(value)
    if (key === 'SENDGRID_EMAIL') credentials.apiEmail = decodeCredential(value)
  })
  return credentials
}

export const getDynamicData = async ({ userId, currentDataList, transaction = null }) => {
  const siteDetail = (await getOne({
    model: db.GlobalSetting,
    data: { key: 'SITE_INFORMATION' },
    attributes: ['value'],
    raw: true,
    transaction
  })).value

  const userDetails = await getOne({
    model: db.User,
    data: { userId },
    // include: [
    //   { model: db.Wallet, as: 'userWallet' }
    // ],
    transaction
  })

  const dynamicData = {
    siteName: siteDetail.name,
    siteLogo: (siteDetail.logo || ""),
    siteUrl: siteDetail.url,
    playerEmail: userDetails.email,
    playerFullName: userDetails.username,
    playerFirstName: userDetails.firstName || userDetails.username,
    playerLastName: userDetails.lastName || '',
    userName: userDetails.username,
    // walletAmountTotal: parseFloat((userDetails.userWallet.amount + userDetails.userWallet.nonCashAmount).toFixed(2)),
    // walletAmountBonus: parseFloat(userDetails.userWallet.nonCashAmount.toFixed(2)),
    // walletAmountReal: parseFloat(userDetails.userWallet.amount.toFixed(2)),
    siteLoginUrl: `${siteDetail.url}/login`,
    sendSupportRequestRoute: `${siteDetail.url}/support-mail`,
    playerCurrencySymbol: getSymbolFromCurrency(userDetails.currencyCode),
    subject: '-',
    reason: '-',
    link: '-',
    withdrawAmount: '-',
    depositAmount: '-',
    transactionId: '-',
    supportEmailAddress: '-',
    kycLabels: '-',
    currentYear: (new Date()).getFullYear()
    // joiningAmount: userDetails.userWallet.nonCashAmount
  }

  return { ...dynamicData, ...currentDataList }
}

export const insertDynamicDataInTemplate = ({ template, dynamicData }) => {
  let returnEmail = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
    returnEmail = returnEmail.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnEmail
}

export const createEmailWithDynamicValues = async ({ emailType, userId, serviceData, language, transaction = null }) => {
  const dynamicData = { ...serviceData }
  let templateDetails = await db.EmailTemplate.findOne({
    where: { type: emailType, isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY },
    raw: true,
    transaction
  })

  if (!templateDetails) {
    templateDetails = await db.EmailTemplate.findOne({
      where: { isDefault: true, type: emailType },
      raw: true,
      transaction
    })
  }
  const newDynamicData = {
    ...await getDynamicData({ userId, dataList: templateDetails.dynamicData, currentDataList: dynamicData, transaction: transaction })
  }

  const emailData = insertDynamicDataInTemplate({ template: templateDetails.templateCode[language] || templateDetails.templateCode.EN, dynamicData: newDynamicData })

  return emailData
}

export const insertDynamicDataInCmsTemplate = ({ template, dynamicData }) => {
  let returnCms = template

  Object.keys(dynamicData).forEach(dynamicKey => {
    const pattern = new RegExp(`{{{ *${dynamicKey} *}}}`, 'g')
    returnCms = returnCms.replaceAll(pattern, dynamicData[dynamicKey])
  })

  return returnCms
}

export const getDynamicDataValue = async () => {
  const siteDetail = (await getOne({
    model: db.GlobalSetting,
    data: { key: 'SITE_INFORMATION' },
    attributes: ['value'],
    raw: true
  })).value

  let supportEmailAddress
  if (siteDetail.supportEmail) supportEmailAddress = siteDetail.supportEmail
  else supportEmailAddress = ''

  const dynamicData = {
    siteName: siteDetail.name,
    siteLogo: siteDetail.url,
    siteUrl: siteDetail.logo,
    supportEmailAddress,
    currentYear: (new Date()).getFullYear()
  }

  return dynamicData
}

export const sendDynamicEmail = async ({ recieverEmail, subject, text, dynamicEmail, successMsg }) => {
  const API_KEY = config.get('mailGun.apiKey')
  const DOMAIN = config.get('mailGun.domain')
  const senderEmail = config.get('mailGun.senderEmail')

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: 'api', key: API_KEY });

  const messageData = {
    from: senderEmail,
    to: recieverEmail,
    subject: subject,
    text: text || 'Testing some Mailgun awesomeness...',
    html: dynamicEmail
  }

  try {
    const res = await client.messages.create(DOMAIN, messageData)
    return { success: successMsg, message: res, status: 200 }
  } catch (error) {
    return { success: false, message: 'Unable to send email.', status: 400 }
  }
}

// export const userEmail = async ({ user, emailTemplate, data, credentials }) => {
//   if (Object.keys(credentials).length === 2) {
//     const dynamicEmail = await createEmailWithDynamicValues({
//       language: user.locale || 'EN',
//       emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[emailTemplate],
//       userId: user.userId,
//       serviceData: { ...data }
//     })

//     await sendDynamicMail({
//       user,
//       credentials,
//       subject: data.subject,
//       successMsg: SUCCESS_MSG.EMAIL_SENT,
//       dynamicEmail
//     })
//   }
// }

export const sendEmail = async ({ user, emailTemplate, data, message }) => {
  const dynamicEmail = await createEmailWithDynamicValues({
    language: user.locale || 'EN',
    emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[emailTemplate],
    userId: user.userId,
    serviceData: { ...data }
  })

  const emailSent = await sendDynamicEmail({
    recieverEmail: user.email,
    subject: data.subject,
    text: 'mailGun testing...',
    successMsg: message || SUCCESS_MSG.EMAIL_SUCCESS,
    dynamicEmail
  })

  return emailSent
}

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendEmailByMailjetResetPassword({ user, data, dynamicEmail, senderEmail, senderName }) {
  try {

    const Mailjet = new mailjet({
      apiKey: config.get('email.mailjetApiKey'),
      apiSecret: config.get('email.mailjetSecretKey'),
      options: {
        timeout: 5000
      }
    })

    const response = await Mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName
          },
          To: [{
            Email: user.email,
            Name: user.username
          }],
          Subject: data.subject,
          HTMLPart: dynamicEmail, // `<p>Click <a href="${data.link}">here</a> to reset your password.</p>`,
          TextPart: data.body,
        }
      ]
    })

    return response.response.status === 200
  } catch (error) {
    return error
  }
}


export async function sendEmailByMailjet({ user, data, emailTemplate, senderEmail, senderName }) {
  try {
    const Mailjet = new mailjet({
      apiKey: config.get('email.mailjetApiKey'),
      apiSecret: config.get('email.mailjetSecretKey'),
      options: {
        timeout: 5000
      }
    })
    const response = await Mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: senderName
          },
          To: [{
            Email: user.email,
            Name: user.username
          }],
          Subject: data.subject,
          HTMLPart: emailTemplate,
          TextPart: data.body,
        }
      ]
    })
    return response.response.status === 200
  } catch (error) {
    return error
  }
}


export const sendMailjetEmail = async ({ user, emailTemplate, data, message }) => {

  const dynamicEmail = await createEmailWithDynamicValues({
    language: user.locale || 'EN',
    emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[emailTemplate],
    userId: user.userId,
    serviceData: { ...data }
  })

  const emailSent = await sendEmailByMailjet({
    user,
    data,
    emailTemplate: dynamicEmail,
    senderName: config.get('email.senderName'),
    senderEmail: config.get('email.senderEmail'),
  })

  return emailSent
}


export const sendMailjetEmailResetPassword = async ({ user, emailTemplate, data, message }) => {

  const dynamicEmail = await createEmailWithDynamicValues({
    language: user.locale || 'EN',
    emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[emailTemplate],
    userId: user.userId,
    serviceData: { ...data }
  })
  const emailSent = await sendEmailByMailjetResetPassword({
    user,
    data,
    dynamicEmail: dynamicEmail,
    senderName: config.get('email.senderName'),
    senderEmail: config.get('email.senderEmail'),
  })

  return emailSent
}
