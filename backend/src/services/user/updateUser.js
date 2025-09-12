import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { S3_FILE_PREFIX } from '@src/utils/constants/constants'
import { s3FileUpload } from '@src/utils/s3.utils'

export class UpdateUserHandler extends BaseHandler {
  async run() {
    const {
      userId,
      dateOfBirth,
      firstName,
      lastName,
      phone,
      gender,
      stateCode,
      address,
      city,
      zip,
      profileImage,
    } = this.args

    const transaction = this.context.sequelizeTransaction

    console.log('UpdateUserHandler received:', { userId, dateOfBirth, firstName, lastName, phone, gender, stateCode, address, city, zip });

    // 1️⃣ Find User
    const user = await db.User.findOne({
      where: { userId },
      transaction,
    })

    if (!user) {
      console.error('User not found for userId:', userId);
      throw new AppError(Errors.USER_NOT_FOUND);
    }

    // 2️⃣ Prepare User object
    const userObj = {}
    if (firstName) userObj.firstName = firstName
    if (lastName) userObj.lastName = lastName
    if (phone) userObj.phone = phone
    if (gender) userObj.gender = gender
    if (dateOfBirth) userObj.dateOfBirth = dateOfBirth
    if (stateCode) userObj.stateCode = stateCode
    if (city) userObj.city = city

    if (profileImage) {
      const imageLocation = await this.uploadProfileImage(profileImage)
      userObj.profileImage = imageLocation.location
    }

    // 3️⃣ Update User table
    await user.set(userObj).save({ transaction })

    // 4️⃣ Ensure UserDetails always exists and update it
    await this.ensureAndUpdateUserDetails({ userId, address, zip, transaction })

    console.log('UpdateUserHandler completed for userId:', userId);
    return { success: true }
  }

  /**
   * Handles uploading profile image to S3
   */
  async uploadProfileImage(profileImage) {
    return s3FileUpload(profileImage.buffer, {
      name: profileImage.originalname,
      mimetype: profileImage.mimetype,
      filePathInS3Bucket: S3_FILE_PREFIX.profileImage,
    })
  }

  /**
   * Guarantees UserDetails exists, then updates address/zip
   */
  async ensureAndUpdateUserDetails({ userId, address, zip, transaction }) {
    const userDetailsList = await db.UserDetails.findAll({
      where: { userId },
      transaction,
    })

    const updateObj = {}
    if (address !== undefined) updateObj.address = address
    if (zip !== undefined) updateObj.zip = zip

    if (userDetailsList.length === 0) {
      // No UserDetails found, create one
      await db.UserDetails.create(
        { userId, address, zip },
        { transaction }
      )
      console.log(`Created new UserDetails for userId: ${userId} with`, updateObj)
    } else {
      // Update all existing UserDetails rows for this user
      console.log(`Updating ${userDetailsList.length} UserDetails rows for userId: ${userId} with`, updateObj)
      await Promise.all(
        userDetailsList.map(userDetails => userDetails.update(updateObj, { transaction }))
      )
    }
  }
}
