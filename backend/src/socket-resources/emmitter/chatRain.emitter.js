import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '@src/utils/constants/socket.constant'
import socketEmitter from '@src/libs/socketEmitter'
import { ERROR_MSG } from '@src/utils/errors'
import Flatted from 'flatted'

export class LiveChatRainEmitter {
    static async emitLiveChatRain(socketObj, groupId) {
        try {
            socketObj = Flatted.parse(Flatted.stringify(socketObj))
            const room = SOCKET_ROOMS.USER_CHAT + ':' + groupId
            socketEmitter.of(SOCKET_NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.LIVE_CHAT_RAIN, { data: { ...socketObj, groupId } })
        } catch (error) {
            Logger.info('Error In Emitter', { message: ERROR_MSG.EMAIL_ERROR })
            Logger.info('Actual Error', { exception: error })
        }
    }

    static async emitClosedChatRain(socketObj, groupId) {
        try {
            socketObj = Flatted.parse(Flatted.stringify(socketObj))
            const room = SOCKET_ROOMS.USER_CHAT + ':' + groupId
            socketEmitter.of(SOCKET_NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.CLOSED_CHAT_RAIN, { data: { ...socketObj, groupId } })
        } catch (error) {
            Logger.info('Error In Emitter', { message: ERROR_MSG.EMAIL_ERROR })
            Logger.info('Actual Error', { exception: error })
        }
    }
}