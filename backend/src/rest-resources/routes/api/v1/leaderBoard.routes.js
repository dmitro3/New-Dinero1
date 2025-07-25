import express from 'express'
import leaderBoardController from '@src/rest-resources/controllers/leaderBoard.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getCasinoTransactionsSchema } from '@src/json-schemas/favorites/getCasinoTransactions'
import { getRecentBigWinsSchema } from '@src/json-schemas/favorites/getRecentBigWins'

const args = { mergeParams: true }
const leaderBoardRouter = express.Router(args)

leaderBoardRouter.route('/transactions')
  .get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getCasinoTransactionsSchema), leaderBoardController.getLeaderBoardHandler)
leaderBoardRouter.route('/top-winners').get(contextMiddleware(false), isUserAuthenticated, leaderBoardController.getTopWinnersHandler)
leaderBoardRouter.route('/recent-big-win').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getRecentBigWinsSchema), leaderBoardController.getRecentBigWins)

export { leaderBoardRouter }
