// import multer from 'multer'
import express from 'express'

import BonusController from '@src/rest-resources/controllers/bonus.controller'
import UserController from '@src/rest-resources/controllers/user.controller'
// import { CasinoController } from '@src/rest-resources/controllers/casino.controller'
import AffiliateController from '@src/rest-resources/controllers/affiliate.controller'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
// import { validateSignature } from '@src/rest-resources/middlewares/validateSignature'
import { getAllBonusSchema } from '@src/json-schemas/user/getAllBonus.schema'
import { getOtpSchema } from '@src/json-schemas/user/getOtp.schema'
import { getReferredUsersSchema } from '@src/json-schemas/user/getReferredUsers.schema'
import { getUserBonusSchema } from '@src/json-schemas/user/getUserBonus.schema'
import { getUserDetailsSchema } from '@src/json-schemas/user/getUserDetails.schema'
import { getUserTransactionsSchema } from '@src/json-schemas/user/getUserTransactions.schema'
import { setDefaultWalletSchema } from '@src/json-schemas/user/setDefaultWallet.schema'
import { updateSelfExclusionSchema } from '@src/json-schemas/user/updateSelfExlusion.schema'
import { updateUserDetailsSchema } from '@src/json-schemas/user/updateUserDetails.schema'
import { userLoginSchema } from '@src/json-schemas/user/userLogin.schema'
import { userSignUpSchema } from '@src/json-schemas/user/userSignUp.schema'
import { verifyEmailSchema } from '@src/json-schemas/user/verifyEmail.schema'
import { verifyForgotPasswordSchema } from '@src/json-schemas/user/verifyForgotPasswordSchema'
import { verifyOtpSchema } from '@src/json-schemas/user/verifyOtp.schema'
import { getAllWithdrawRequestSchema } from '@src/json-schemas/wallet/getAllWithdrawRequests'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import { geoBlock } from '@src/rest-resources/middlewares/location.middleware'
import { uploadSingle } from '@src/rest-resources/middlewares/multer.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import geoVpnBlockMiddleware from '@src/rest-resources/middlewares/geoVpnBlock.middleware'

// const upload = multer()
const args = { mergeParams: true }
const userRouter = express.Router(args)

// Public Routes
userRouter.route('/sign-up').post(geoVpnBlockMiddleware, requestValidationMiddleware(userSignUpSchema), contextMiddleware(true), UserController.userSignUp)
userRouter.route('/login').post(geoVpnBlockMiddleware, requestValidationMiddleware(userLoginSchema), contextMiddleware(false), UserController.userLogin)

userRouter.route('/verify-email').get(requestValidationMiddleware(verifyEmailSchema), contextMiddleware(true), UserController.verifyEmail)

// Referral routes
userRouter.route('/referred-users').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getReferredUsersSchema), AffiliateController.getReferredUsers)

// tg-casino routes
userRouter.route('/transactions').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getUserTransactionsSchema), UserController.getUserTransactions)
userRouter.route('/set-default').post(contextMiddleware(true), requestValidationMiddleware(setDefaultWalletSchema), isUserAuthenticated, UserController.setDefaultWallet)
userRouter.route('/').get(requestValidationMiddleware(getUserDetailsSchema), isUserAuthenticated, UserController.getUserDetails)

userRouter.route('/logout').post(contextMiddleware(false), isUserAuthenticated, UserController.userLogout)
userRouter.route('/update-user').put(contextMiddleware(true), uploadSingle('profileImage'), requestValidationMiddleware(updateUserDetailsSchema), isUserAuthenticated, UserController.updateUserDetails)
userRouter.route('/withdraw-request')
  // .post(contextMiddleware(true), requestValidationMiddleware(createWithdrawRequestSchema), isUserAuthenticated, UserController.createWithdrawRequest)
  .get(contextMiddleware(false), requestValidationMiddleware(getAllWithdrawRequestSchema), isUserAuthenticated, UserController.getWithdrawRequests)

userRouter.route('/get-otp').get(contextMiddleware(false), requestValidationMiddleware(getOtpSchema), isUserAuthenticated, UserController.getOtp)
userRouter.route('/verify-otp').put(contextMiddleware(true), requestValidationMiddleware(verifyOtpSchema), isUserAuthenticated, UserController.verifyOtp)


// Veriff kyc verification
userRouter.route('/init-veriff-kyc').get(contextMiddleware(true), isUserAuthenticated, requestValidationMiddleware({}), UserController.createVeriffSession)
userRouter.route('/veriff-callback').post(contextMiddleware(true), requestValidationMiddleware({}), UserController.veriffCallback)


// userRouter.route('/upate-user').post(contextMiddleware(false), isUserAuthenticated, UserController.userSignUp)
userRouter.route('/verify-forget-password').post(contextMiddleware(true), requestValidationMiddleware(verifyForgotPasswordSchema), UserController.verifyForgetPassword)

userRouter.route('/change-password').put(contextMiddleware(true), isUserAuthenticated, UserController.changePassword)

userRouter.route('/forget-password').post(contextMiddleware(true), UserController.forgetPassword)

// userRouter.route('/get-current-winners').get(contextMiddleware(false), UserController.getCurrentWinners)

// userRouter.route('/refresh-email-token').post(contextMiddleware(true), UserController.refreshEmailToken)

// userRouter.route('/check-unique-constraints').get(contextMiddleware(false), UserController.checkEmailUsername)

// Microservice Routes

// userRouter.route('/cancel-free-spins').post(contextMiddleware(false), validateSignature, UserController.cancelFreespins)

// Private Routes

// userRouter.route('/set-loss-limit').post(contextMiddleware(false), isUserAuthenticated, UserController.setLossLimit)

// userRouter.route('/get-limit-table').get(contextMiddleware(false), isUserAuthenticated, UserController.getLimitTable)

// userRouter.route('/set-daily-limit').post(contextMiddleware(false), isUserAuthenticated, UserController.setDailyLimit)

// userRouter.route('/set-session-time').post(contextMiddleware(false), isUserAuthenticated, UserController.setTimeLimit)

// userRouter.route('/set-deposit-limit').post(contextMiddleware(false), isUserAuthenticated, UserController.setDepositLimit)

// userRouter.route('/set-disable-until').post(contextMiddleware(false), isUserAuthenticated, UserController.setDisableUntil)

// userRouter.route('/get-loyalty-details').get(contextMiddleware(false), isUserAuthenticated, UserController.getLoyaltyDetails)

// userRouter.route('/remove-profile-image').put(contextMiddleware(false), isUserAuthenticated, UserController.removeProfileImage)

// userRouter.route('/get-withdraw-requests').get(contextMiddleware(false), isUserAuthenticated, UserController.getWithdrawRequests)

// userRouter.route('/remove-favorite').delete(contextMiddleware(true), isUserAuthenticated, CasinoController.removeFavoriteGame)

// userRouter.route('/favorite-games').get(contextMiddleware(false), isUserAuthenticated, CasinoController.getFavoriteGame)

// userRouter.route('/upload-profile-image').put(contextMiddleware(false), upload.single('profileImage'), isUserAuthenticated, UserController.uploadProfileImage)

// userRouter.route('/wallet-amount').get(contextMiddleware(false), isUserAuthenticated, UserController.walletAmount)

// userRouter.route('/upload-huawei-image').post(contextMiddleware(false), upload.single('image'), isUserAuthenticated, UserController.uploadImage)

// userRouter.route('/currency-code').put(contextMiddleware(false), isUserAuthenticated, UserController.updateCurrencyCode)

userRouter.route('/self-exclusion').put(contextMiddleware(true), requestValidationMiddleware(updateSelfExclusionSchema), isUserAuthenticated, UserController.updateSelfExclusion)

// userRouter.route('/ghost-mode').put(contextMiddleware(true), isUserAuthenticated, UserController.updateGhostMode)

// Bonus APIs
userRouter.route('/user-bonus').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getUserBonusSchema), BonusController.getUserBonus)
userRouter.route('/get-all-bonus').get(requestValidationMiddleware(getAllBonusSchema), isUserAuthenticated, BonusController.getAllBonus)

// userRouter.route('/avail-bonus').post(contextMiddleware(true), requestValidationMiddleware(availBonusSchema), isUserAuthenticated, BonusController.availBonus)
// userRouter.route('/cancel-bonus').put(contextMiddleware(true), requestValidationMiddleware(cancelBonusSchema), isUserAuthenticated, BonusController.cancelBonus)
// userRouter.route('/bonus-detail').get(requestValidationMiddleware(getBonusDetailSchema), isUserAuthenticated, BonusController.getBonusDetail)


export { userRouter }
