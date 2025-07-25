import { GetBalanceOneGameHubCasinoHandler } from '@src/services/providers/1GameHub/balance.one.game.hub.casino.service'
import { BetOneGameHubCasinoHandler } from '@src/services/providers/1GameHub/bet.one.game.hub.casino.service'
import { WinOneGameHubGameCasinoHandler } from '@src/services/providers/1GameHub/win.one.game.hub.casino.service'
import { COINS, ONE_GAME_HUB_REQUEST_ACTIONS } from '@src/utils/constants/public.constants'
import { OneGameHubError } from '@src/utils/constants/casinoProviders/oneGameHub.constants'
import { CancelBetOneGameHubCasinoHandler } from '@src/services/providers/1GameHub/cancel.bet.one.game.hub.casino.service'

export class OneGameHubCasinoController {
  static async OneGameHubCallbacks(req, res) {
    try {
      switch (req.query.action) {
        case ONE_GAME_HUB_REQUEST_ACTIONS.BET: {
          const data = await BetOneGameHubCasinoHandler.execute({ ...req.body, ...req.query }, req.context)
          if (data?.status)
            res.status(data.status).json(data)
          else
            res.status(200).json(data);
          break
        }
        case ONE_GAME_HUB_REQUEST_ACTIONS.WIN: {
          const data = await WinOneGameHubGameCasinoHandler.execute({ ...req.body, ...req.query }, req.context)
          if (data?.status)
            res.status(data.status).json(data)
          else
            res.status(200).json(data);
          break
        }
        case ONE_GAME_HUB_REQUEST_ACTIONS.BALANCE: {
          const data = await GetBalanceOneGameHubCasinoHandler.execute({ ...req.body, ...req.query }, req.context)
          if (data?.status)
            res.status(data.status).json(data)
          else
            res.status(200).json(data);
          break
        }
        case ONE_GAME_HUB_REQUEST_ACTIONS.CANCEL: {
          const data = await CancelBetOneGameHubCasinoHandler.execute({ ...req.body, ...req.query }, req.context)
          if (data?.status)
            res.status(data.status).json(data)
          else
            res.status(200).json(data);
          break
        }
        default:
          // sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
          res.status(OneGameHubError.unknownError.status || 500).json(OneGameHubError.unknownError)
          break
      }
    } catch (error) {
      console.log("=== one game hub error ==", error, "============================================================")

      res.status(OneGameHubError.unknownError.status).json(OneGameHubError.unknownError)
    }
  }
}
