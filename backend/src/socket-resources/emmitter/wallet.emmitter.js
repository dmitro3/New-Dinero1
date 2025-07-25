import Flatted from 'flatted'
import Logger from '@src/libs/logger'
import { ERROR_MSG } from '@src/utils/errors'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '@src/utils/constants/socket.constant'
import socketEmitter from '@src/libs/socketEmitter'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class WalletEmitter {
  static async emitUserWalletBalance(socketObj, playerId) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.USER_WALLET + ':' + +playerId
      socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.USER_WALLET_BALANCE, { data: { ...socketObj, playerId } })
      console.log("suvvvvesssssssssssssssss", room, socketObj)
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitLeaderBoardData(socketObj, playerId) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.LEADER_BOARD
      socketEmitter.of(SOCKET_NAMESPACES.LEADER_BOARD).to(room).emit(SOCKET_EMITTERS.LEADER_BOARD, { data: socketObj })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }


  static async emitRecentBigWinData(socketObj, playerId) {
    try {
      socketObj = Flatted.parse(Flatted.stringify(socketObj))
      const room = SOCKET_ROOMS.RECENT_BIG_WIN
      socketEmitter.of(SOCKET_NAMESPACES.RECENT_BIG_WIN).to(room).emit(SOCKET_EMITTERS.RECENT_BIG_WIN, { data: socketObj })
    } catch (error) {
      Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
      Logger.info('Actual Error', { exception: error })
    }
  }

}


