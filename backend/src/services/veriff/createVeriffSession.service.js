import config from '@src/configs/app.config'
import db from "@src/db/models"
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { VeriffAxios } from "@src/libs/axios/veriff.axios"
import { BaseHandler } from "@src/libs/logicBase"
import { VERIFF_STATUS } from "@src/utils/constant"


export class CreateVeriffSessionService extends BaseHandler {

  async run() {
    const transaction = this.dbTransaction
    const { userId } = this.args
    console.log("========veriff-create-session=========", this.args)
    let data
    const userDetails = await db.User.findOne({ where: { userId }, transaction })
    const userOtherDetails = await db.UserDetails.findOne({ where: { userId }, transaction })
    // if (!userDetails.firstName || !userDetails.lastName || !userDetails.dateOfBirth || !userOtherDetails.address) {
    //   throw new AppError(Errors.VERIFF_REQUEST_VALIDATION_ERROR);
    // }

    const dob = new Date(userDetails.dateOfBirth)
    if (userDetails?.veriffStatus !== VERIFF_STATUS.APPROVED) {
      const payload = {
        verification: {
          callback: config.get('app.userFrontendUrl'),
          person: {
            firstName: userDetails?.firstName || 'demo_user',
            lastName: userDetails?.lastName || 'demo_last_name',
            idNumber: `${userDetails.userId}`,
            // gender: userDetails.gender, // we are not storing gender what if users other fields are not added yet
            dateOfBirth: dob.getFullYear() + '-' + (dob.getMonth() + 1).toString().padStart(2, '0') + '-' + dob.getDate().toString().padStart(2, '0')
          },
          // document: {
          //   number: "B01234567",
          //   type: "PASSPORT",
          //   country: "EE"
          // },
          address: {
            // fullAddress: `${userDetails.addressLine_1}${userDetails.addressLine_2 ? userDetails.addressLine_2 : ''}`,
            fullAddress: userOtherDetails?.address || "Lorem Ipsum 30, 12345 Tallinn, Estonia"
          },
          vendorData: userDetails.username
        }
      }
      const { result } = await VeriffAxios.initVeriff(payload)
      data = result

      if (data.verification) {
        userOtherDetails.veriffApplicantId = data.verification.id
        await userOtherDetails.save({ transaction })
      }
    } else {
      throw new AppError(Errors.VERIFF_ALREADY_VERIFIED_ERROR_TYPE)
    }

    return { ...data }
  }
}
