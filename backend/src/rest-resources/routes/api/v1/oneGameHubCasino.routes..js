// import { AleaCasinoController } from '@src/rest-resources/controllers/alea.casino.controller'
import { OneGameHubCasinoController } from '@src/rest-resources/controllers/one.game.hub.casino.controller'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { validateOneGameHubHash } from '@src/rest-resources/middlewares/validateOneGameHubHash.middleware'
import express from 'express'

const oneGameHubRouter = express.Router()

// POST REQUESTS
// aleaRouter.get('/sessions/:casinoSessionId', AleaCasinoController.aleaSessionCallback)
// aleaRouter.get('/players/:userId/balance', AleaCasinoController.aleaBalanceCallback)
// aleaRouter.post('/transactions', contextMiddleware(true), AleaCasinoController.aleaCallbacks)
oneGameHubRouter.post('/', contextMiddleware(true), validateOneGameHubHash(), OneGameHubCasinoController.OneGameHubCallbacks)
export { oneGameHubRouter }
