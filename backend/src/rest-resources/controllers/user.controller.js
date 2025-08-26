
import { sendResponse } from '@src/helpers/response.helpers'
import {
  ChangePasswordHandler,
  ForgetPasswordHandler,
  GetUserDetailsHandler,
  GetUserTransactionsHandler,
  GetWithdrawRequestsHandler,
  UpdateSelfExclusionHandler,
  UpdateUserHandler,
  UserSignUpHandler,
  VerifyEmailHandler, VerifyForgetPasswordHandler
} from '@src/services/user'
import { GetOtpHandler } from '@src/services/user/getOtp.service'
import { SetDefaultWalletHandler } from '@src/services/user/setDefaultWallet.service'
import { UserLoginHandler } from '@src/services/user/userLogin.handler'
import { UserLogoutHandler } from '@src/services/user/userLogout'
import { VerifyOtpHandler } from '@src/services/user/verifyOtp.service'
import { GetAllWithdrawRequestsHandler } from '@src/services/wallet'
import { UpdateKycStatusService } from '@src/services/veriff/callbacks/updateKycStatus.service'
import { CreateVeriffSessionService } from '@src/services/veriff/createVeriffSession.service'
import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import dns from "dns";

export default class UserController {

  static async getUserDetails (req, res, next) {
    try {
      const data = await GetUserDetailsHandler.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async setDefaultWallet (req, res, next) {
    try {
      const data = await SetDefaultWalletHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateUserDetails (req, res, next) {
    try {
      const data = await UpdateUserHandler.execute({ ...req.body, profileImage: req.file }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  // static async checkEmailUsername(req, res, next) {
  //   try {
  //     const data = await CheckUniqueEmailUsername.execute({ ...req.query, ...req.body })
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async userLogin (req, res, next) {
    try {
      const data = await UserLoginHandler.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }

  }

  static async userLogout (req, res, next) {
    try {
      const data = await UserLogoutHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }




  static async userSignUp (req, res, next) {
    try {
      const data = await UserSignUpHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async getWithdrawRequests (req, res, next) {
    try {
      const data = await GetWithdrawRequestsHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async getUserTransactions (req, res, next) {
    try {
      const data = await GetUserTransactionsHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async verifyEmail (req, res, next) {
  try {
    const result = await VerifyEmailHandler.execute(req.query, req.context);

    if (result?.successful && result?.link) {
      return res.redirect(result.link);
    }

    sendResponse({ req, res, next }, result);
  } catch (error) {
    next(error);
  }
}


  static async changePassword (req, res, next) {
    try {
      const data = await ChangePasswordHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  // static async refreshEmailToken(req, res, next) {
  //   try {
  //     const data = await RefreshEmailTokenHandler.execute({ ...req.body, ...req.query }, req.context)
  //     sendResponse({ req, res, next }, data)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async forgetPassword (req, res, next) {
    try {
      const data = await ForgetPasswordHandler.execute({ ...req.body, ...req.query, origin: req.headers?.origin }, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async verifyForgetPassword (req, res, next) {
    try {
      const data = await VerifyForgetPasswordHandler.execute(req.body)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateSelfExclusion (req, res, next) {
    try {
      const data = await UpdateSelfExclusionHandler.execute(req.body, req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getWithdrawRequests (req, res, next) {
    try {
      const data = await GetAllWithdrawRequestsHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

static async getOtp(req, res, next) {
  try {
    const { userId, userEmail, username } = { ...req.body, ...req.query };

    if (!userId || !userEmail) {
      throw new AppError({
        name: "ValidationError",
        message: "Missing required fields",
        explanation: "userId and userEmail are required",
        httpStatusCode: 400,
        code: 400,
      });
    }

    // ✅ Step 1: Basic email format check
   const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(userEmail)) {
      throw new AppError({
        name: "ValidationError",
        message: "Invalid email format",
        explanation: "Please provide a valid email address",
        httpStatusCode: 400,
        code: 400,
      });
    }

    // ✅ Step 2: Domain MX record check
    const domain = userEmail.split("@")[1];
    const hasValidDomain = await new Promise((resolve) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

    if (!hasValidDomain) {
      throw new AppError({
        name: "ValidationError",
        message: "Invalid email domain",
        explanation: "The email domain does not exist or cannot receive mail",
        httpStatusCode: 400,
        code: 400,
      });
    }

    // ✅ Duplicate email check
    const existingUser = await db.User.findOne({ where: { email: userEmail } });
    if (existingUser) {
      throw new AppError({
        name: "ValidationError",
        message: "Email already in use",
        explanation: "This email is already registered with another account",
        httpStatusCode: 400,
        code: 400,
      });
    }

    // ✅ Continue if valid
    const data = await GetOtpHandler.execute({ userId, userEmail, username });
    sendResponse({ req, res, next }, data);

  } catch (error) {
    console.error("❌ OTP Error:", error);
    next(error);
  }
}




  static async verifyOtp (req, res, next) {
    try {
      const data = await VerifyOtpHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }


  static async createVeriffSession (req, res, next) {
    try {
      const result = await CreateVeriffSessionService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async veriffCallback (req, res, next) {
    try {
      const result = await UpdateKycStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }


}
