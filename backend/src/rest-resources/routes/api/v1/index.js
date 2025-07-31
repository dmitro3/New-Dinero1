import express from 'express'

import { bannerRouter } from './banner.router'
import { casinoRouter } from './casino.router'
import { gsoftRouter } from './gsoft.router'
import { siteRouter } from './site.router'
import { userRouter } from './user.router'
import { leaderBoardRouter } from './leaderBoard.routes'
// import { documentRouter } from './document.router'
// import { affiliateRouter } from './affiliate.router'
import { paymentRouter } from './payment.router'
// import {  } from './payment.router'
// import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { faucetRouter } from './faucet.router'
import { packageRouter } from './package.router'
import spinWheelRouter from './spinWheel.router'
import { ticketRouter } from './ticket.router'
import { vipTierRouter } from './vipTier.router'
import { bonusRouter } from './bonus.routes'
import { notificationRouter } from './notification.routes'
import { liveChatRouter } from './liveChat.router'
import { postalCodeRouter } from './postalCode.routes'
import authSsoRouter from './auth.sso.router'

const v1router = express.Router()
v1router.use('/vip-tier', vipTierRouter, responseValidationMiddleware({}))
v1router.use('/bonus', bonusRouter, responseValidationMiddleware({}))
v1router.use('/notification', notificationRouter, responseValidationMiddleware({}))
v1router.use('/user', userRouter, responseValidationMiddleware({}))
v1router.use('/casino', casinoRouter, responseValidationMiddleware({}))
v1router.use('/banner', bannerRouter, responseValidationMiddleware({}))
v1router.use('/callback/gsoft', gsoftRouter, responseValidationMiddleware({}))
v1router.use('/payment', paymentRouter, responseValidationMiddleware({}))
v1router.use('/postal-code', postalCodeRouter, responseValidationMiddleware({}))
v1router.use('/package', packageRouter, responseValidationMiddleware({}))
v1router.use('/spin-wheel-configuration', spinWheelRouter, responseValidationMiddleware({}))
v1router.use('/faucet', faucetRouter, responseValidationMiddleware({}))
v1router.use('/ticket', ticketRouter, responseValidationMiddleware({}))
v1router.use('/live-chat', liveChatRouter, responseValidationMiddleware({}))
v1router.use('/leader-board', leaderBoardRouter, responseValidationMiddleware({}))
v1router.use('/auth/sso', authSsoRouter);
v1router.use('/', siteRouter, responseValidationMiddleware({}))

// v1router.use('/affiliate', requestValidationMiddleware({}), contextMiddleware(false), affiliateRouter, responseValidationMiddleware({}))
// Casino Callbacks
export default v1router
