import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { generateOtp, sendMailjetEmail } from '../helper/email'
import { EMAIL_SUBJECTS, EMAIL_TEMPLATE_TYPES } from '@src/utils/constant'
import { SUCCESS_MSG } from '@src/utils/success'
import { getCache, setCache } from '@src/libs/redis'
import db from '@src/db/models'


export class GetOtpHandler extends BaseHandler {
  async run() {
    const { userId, userEmail, username } = this.args;

    if (!userId || !userEmail) {
      throw new AppError(Errors.MISSING_REQUIRED_FIELDS);
    }

    const userObj = { userId, email: userEmail, username };

    // Check DB connection + existing user
    const user = await db.User.findOne({ where: { userId }, attributes: ['isEmailVerified'] });
    if (!user) {
      throw new AppError(Errors.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new AppError(Errors.EMAIL_ALREADY_VERIFIED);
    }

    const otp = generateOtp();

    // Ensure mail service env vars are loaded
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      throw new AppError(Errors.MAIL_SERVICE_NOT_CONFIGURED);
    }

    const emailSent = await sendMailjetEmail({
      user: userObj,
      emailTemplate: EMAIL_TEMPLATE_TYPES.EMAIL_VERIFICATION,
      data: {
        link: `OTP: ${otp}`,
        subject: EMAIL_SUBJECTS[userObj.locale]?.verification || EMAIL_SUBJECTS.EN.verification,
        body: `${EMAIL_TEMPLATE_TYPES.OTP_VERIFICATION}: ${otp}`
      },
      message: SUCCESS_MSG.EMAIL_SENT
    });

    if (!emailSent) {
      throw new AppError(Errors.INTERNAL_SERVER_ERROR);
    }

    await setCache(`${userObj.userId}:${otp}`, userObj.email, 300);

    return {
      message: 'success',
      emailSent: emailSent.success || true,
      userId: userObj.userId
    };
  }
}

