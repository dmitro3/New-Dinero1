import { addFavoriteGameSchema } from '@src/json-schemas/casino/addFavoriteGame.schema'
import { getAllGamesSchema } from '@src/json-schemas/casino/getAllGames.schema'
import { getCasinoGamesSchema } from '@src/json-schemas/casino/getCasinoGames.schema'
import { getCasinoTransactionsSchema } from '@src/json-schemas/casino/getCasinoTransactions.schema'
import { getFavoriteGameSchema } from '@src/json-schemas/casino/getFavoriteGame.schema'
import { removeFavoriteGameSchema } from '@src/json-schemas/casino/removeFavoriteGame.schema'
import { CasinoController } from '@src/rest-resources/controllers/casino.controller'
import { isUserAuthenticated, semiAuth } from '@src/rest-resources/middlewares/isUserAuthenticated'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import express from 'express'
import { aleaRouter } from './aleaCasino.routes'
import { oneGameHubRouter } from './oneGameHubCasino.routes.'

const args = { mergeParams: true }
const casinoRouter = express.Router(args)

casinoRouter.route('/game-category').get(CasinoController.getGameCategory)
casinoRouter.route('/game-provider').get(CasinoController.getGameProvider)
casinoRouter.route('/games').get(semiAuth, requestValidationMiddleware(getCasinoGamesSchema), CasinoController.getCasinoGames) // according to category
casinoRouter.route('/all-games').get(semiAuth, requestValidationMiddleware(getAllGamesSchema), CasinoController.getAllGames)
casinoRouter.route('/favorite')
  .get(requestValidationMiddleware(getFavoriteGameSchema), isUserAuthenticated, CasinoController.getFavoriteGame)
  .post(requestValidationMiddleware(addFavoriteGameSchema), isUserAuthenticated, CasinoController.addFavoriteGame)
  .delete(requestValidationMiddleware(removeFavoriteGameSchema), isUserAuthenticated, CasinoController.removeFavoriteGame)
casinoRouter.route('/transactions').get(isUserAuthenticated, requestValidationMiddleware(getCasinoTransactionsSchema), CasinoController.getCasinoTransactions)
casinoRouter.route('/play-game').get(semiAuth, CasinoController.genericGamelaunch) // according to specific sub category
casinoRouter.route('/sync-onegamehub-games').post(contextMiddleware(true), isUserAuthenticated, CasinoController.syncOneGameHubGames) // sync 1GameHub games

// Casino Callbacks
casinoRouter.use('/alea', aleaRouter)
casinoRouter.use('/one-game-hub', oneGameHubRouter)

export { casinoRouter }
