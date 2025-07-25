import { sendCasinoCallbackResponse, sendCasinoErrorResponse } from '@src/helpers/casinoCallback.helper'
import { GetBalanceAleaCasinoHandler } from '@src/services/providers/alea/balance.alea.casino.service'
import { BetAleaCasinoHandler } from '@src/services/providers/alea/bet.alea.casino.service'
import { BetAndWinAleaCasinoHandler } from '@src/services/providers/alea/betWin.alea.casino.service'
import { RollBackAleaCasinoHandler } from '@src/services/providers/alea/rollback.alea.casino.service'
import { GetSessionAleaCasinoHandler } from '@src/services/providers/alea/session.alea.casino.service'
import { WinAleaCasinoHandler } from '@src/services/providers/alea/win.alea.casino.service'
import { ALEA_ERROR_TYPES, ALEA_PLAY_CASINO_TYPES } from '@src/utils/constants/casinoProviders/alea.constants'

export class AleaCasinoController {
  static async aleaCallbacks(req, res, next) {
    const stringData = req.rawBody?.toString('utf-8').replace(/\s/g, '')

    try {
      switch (req.body.type) {
        case ALEA_PLAY_CASINO_TYPES.BET: {
          const data = await BetAleaCasinoHandler.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, data)
          break
        }
        case ALEA_PLAY_CASINO_TYPES.WIN: {
          const data = await WinAleaCasinoHandler.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, data)
          break
        }
        case ALEA_PLAY_CASINO_TYPES.BET_WIN: {
          const data = await BetAndWinAleaCasinoHandler.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, data)
          break
        }
        case ALEA_PLAY_CASINO_TYPES.ROLLBACK: {
          const data = await RollBackAleaCasinoHandler.execute({ ...req.body, signature: req.headers.digest, stringData }, req.context)
          sendCasinoCallbackResponse({ req, res, next }, data)
          break
        }
        default:
          sendCasinoErrorResponse({ req, res, next }, { INTERNAL_ERROR: ALEA_ERROR_TYPES.INTERNAL_ERROR })
          break
      }
    } catch (error) {
      console.log(error, "============================================================")
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, error)
      } else {
        sendCasinoErrorResponse({ req, res, next }, ALEA_ERROR_TYPES.INTERNAL_ERROR)
      }
    }
  }

  static async aleaBalanceCallback(req, res, next) {
    try {
      const data = await GetBalanceAleaCasinoHandler.execute({ playerId: req.params.userId, ...req.query, signature: req.headers.digest, type: 'BALANCE' }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, data)
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, ALEA_ERROR_TYPES.INTERNAL_ERROR)
      }
    }
  }

  static async aleaSessionCallback(req, res, next) {
    try {
      const data = await GetSessionAleaCasinoHandler.execute({ casinoSessionId: req.params.casinoSessionId, ...req.query, signature: req.headers.digest, type: 'SESSION' }, req.context)
      sendCasinoCallbackResponse({ req, res, next }, data)
    } catch (error) {
      if (error?.status) {
        sendCasinoErrorResponse({ req, res, next }, { error })
      } else {
        sendCasinoErrorResponse({ req, res, next }, ALEA_ERROR_TYPES.INTERNAL_ERROR)
      }
    }
  }
}
