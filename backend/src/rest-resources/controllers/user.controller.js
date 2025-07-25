
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
      const data = await VerifyEmailHandler.execute(req.query, req.context)
      if (successful && result.link) return res.redirect(result.link)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
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

  static async getOtp (req, res, next) {
    try {
      const data = await GetOtpHandler.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
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
