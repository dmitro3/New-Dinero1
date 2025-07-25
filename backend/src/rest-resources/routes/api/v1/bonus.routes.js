import express from 'express'

import BonusController from '@src/rest-resources/controllers/bonus.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getDropBonusSchema } from '@src/json-schemas/bonus/getDropBonus.schema'
import { claimBonusDropSchema } from '@src/json-schemas/bonus/claimBonusDrop.schema'
import { claimWelcomeBonusSchema } from '@src/json-schemas/bonus/welcomeBonus/claimWelcomeBonus.schema'

const args = { mergeParams: true }
const bonusRouter = express.Router(args)

bonusRouter.route('/drop-bonus').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getDropBonusSchema), BonusController.GetDropBonus)
bonusRouter.route('/claim-bonus-drop').post(contextMiddleware(true), isUserAuthenticated, requestValidationMiddleware(claimBonusDropSchema), BonusController.claimDropbonus)

//welcome Bonus
bonusRouter.route('/get-welcome-bonus').get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware({}), BonusController.getWelcomebonus)
bonusRouter.route('/claim-welcome-bonus').post(contextMiddleware(true), isUserAuthenticated, requestValidationMiddleware(claimWelcomeBonusSchema), BonusController.claimWelcomebonus)


export { bonusRouter }
