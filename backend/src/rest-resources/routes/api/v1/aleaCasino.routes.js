import { AleaCasinoController } from '@src/rest-resources/controllers/alea.casino.controller'
import { aleaDatabaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/aleaDatabaseTransactionHandler.middleware'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import express from 'express'

const aleaRouter = express.Router()

// POST REQUESTS
aleaRouter.get('/sessions/:casinoSessionId', AleaCasinoController.aleaSessionCallback)
aleaRouter.get('/players/:userId/balance', AleaCasinoController.aleaBalanceCallback)
aleaRouter.post('/transactions', contextMiddleware(true), AleaCasinoController.aleaCallbacks)
export { aleaRouter }
