import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { isOver18 } from '@src/utils/common'
import { S3_FILE_PREFIX } from '@src/utils/constants/constants'
import { s3FileUpload } from '@src/utils/s3.utils'

export class UpdateUserHandler extends BaseHandler {

  async run () {

    const { userId, dateOfBirth, firstName, lastName, phone, gender, stateCode, address, city, zip } = this.args
    const profileImage = this.args.profileImage
    const transaction = this.context.sequelizeTransaction

    const user = await db.User.findOne({
      where: { userId },
      transaction
    })
    const userObj = {}
    if (isOver18(dateOfBirth)) throw new AppError(Errors.AGE_IS_BELOW18)
    if (firstName) userObj.firstName = firstName
    if (lastName) userObj.lastName = lastName
    if (phone) userObj.phone = phone
    if (gender) userObj.gender = gender
    if (dateOfBirth) userObj.dateOfBirth = dateOfBirth
    if (stateCode) userObj.stateCode = stateCode
    if (city) userObj.city = city
    if (profileImage) {
      const imageLocation = await s3FileUpload(profileImage.buffer, {
        name: profileImage.originalname,
        mimetype: profileImage.mimetype,
        filePathInS3Bucket: S3_FILE_PREFIX.profileImage
      })
      userObj.profileImage = imageLocation.location

    }
    await user.set({ ...userObj }).save({ transaction })

    if (address || zip) {
      const userDetails = await db.UserDetails.findOne({
        where: { userId },
        transaction
      })

      if (userDetails) {
        const userDetailsObj = {}
        if (address) userDetailsObj.address = address
        if (zip) userDetailsObj.zip = zip

        await userDetails.set({ ...userDetailsObj }).save({ transaction })
      }
    }


    return { success: true }
  }
}
