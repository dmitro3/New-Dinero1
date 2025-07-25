import express from 'express'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { GsoftCasinoController } from '@src/rest-resources/controllers/casino.controller'
import { validateGsoftGame } from '@src/rest-resources/middlewares/validateGsoftGame.middleware'

const args = { mergeParams: true }
const gsoftRouter = express.Router(args)

gsoftRouter.route('/').get(validateGsoftGame, GsoftCasinoController.casinoCallback)

export { gsoftRouter }
