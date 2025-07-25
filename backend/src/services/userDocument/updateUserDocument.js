import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import { Op } from 'sequelize'
import db from '@src/db/models'
// import config from '@src/configs/app.config'
import { uploadHuaweiImage } from '@src/utils/common'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'
// import { sendEmail } from '../helper/email'
// import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES, STATUS } from '@src/utils/constant'
import { STATUS } from '@src/utils/constant'

export class UpdateDocumentHandler extends BaseHandler {
   async run () {
    const { document, user, documentLabelId, level } = this.args
    // const transaction = this.context.sequelizeTransaction
  
      const documentLabel = await db.DocumentLabel.findOne({
        where: { documentLabelId }
      })
      if (!documentLabel) throw new AppError(Errors.DOCUMENT_LABELS_NOT_FOUND)

      const documentExists = await db.UserDocument.findOne({
        where: { userId: user.userId, status: { [Op.in]: [STATUS.PENDING, STATUS.APPROVED] }, level: level }
      })
      console.log(documentExists)
      if (documentExists) throw new AppError(Errors.DOCUMENTS_ALREADY_UPLOADED)

      if (level === '3' || level === '4') {
        const userDocument = await db.UserDocument.findOne({
          where: { level: parseInt(level) - 1 }
        })
        if (!userDocument) throw new AppError(Errors.WRONG_USER_DOCUMENTS_LEVEL)
      }

      const documentData = await uploadHuaweiImage(document)
      await db.UserDocument.create({
        userId: user.userId,
        documentUrl: documentData,
        level: level,
        documentName: documentLabel.name.EN
      })

      // const dynamicEmail = await createEmailWithDynamicValues({
      //   language: user.locale || 'EN',
      //   emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.KYC_RECEIVED],
      //   userId: user.userId,
      //   serviceData: {
      //     subject: EMAIL_SUBJECTS[user.locale].kycReceived || EMAIL_SUBJECTS.EN.kycReceived
      //   },
      //   transaction
      // })

      // await sendDynamicMail({ user: user, subject: EMAIL_SUBJECTS[user.locale].kycReceived || EMAIL_SUBJECTS.EN.kycReceived, successMsg: SUCCESS_MSG.EMAIL_SENT, dynamicEmail })

      // const userDetails = await db.User.findOne({
      //   where: { userId: user.userId},
      //   attributes: ['userId', 'email', 'locale']
      // })

      // const mail = await sendEmail({
      //   user: userDetails,
      //   emailTemplate: EMAIL_TEMPLATE_TYPES.KYC_VERIFIED,
      //   data: { subject: EMAIL_SUBJECTS[userDetails.locale].kycVerified || EMAIL_SUBJECTS.EN.kycVerified },
      //   message: SUCCESS_MSG.EMAIL_SENT
      // })

      return { documentData, success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
   
  }
}
