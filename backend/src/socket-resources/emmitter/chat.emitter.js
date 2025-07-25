import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from "@src/utils/constants/socket.constant";
import { Logger } from "@src/libs/logger";
import socketEmitter from "@src/libs/socketEmitter";
import { ERROR_MSG } from "@src/utils/errors";
import Flatted from 'flatted';

export class LiveChatsEmitter {
    static async emitLiveChats(socketObj, groupId) {
        try {
            socketObj = Flatted.parse(Flatted.stringify(socketObj))
            const room = SOCKET_ROOMS.USER_CHAT + ':' + groupId
            socketEmitter.of(SOCKET_NAMESPACES.USER_CHAT).to(room).emit(SOCKET_EMITTERS.LIVE_USERS_CHATS, { data: { ...socketObj, groupId } })
        } catch (error) {
            Logger.info('Error In Emitter', { message: ERROR_MSG.EMMITTER_ERROR })
            Logger.info('Actual Error', { exception: error })
        }

    }
}