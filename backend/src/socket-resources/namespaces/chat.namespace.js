import db from "@src/db/models";
import { SOCKET_LISTENERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from "@src/utils/constants/socket.constant";
import ChatHandler from "../handlers/chat.handler";
import Jwt from 'jsonwebtoken'
import config from '@src/configs/app.config'
import { GLOBAL_GROUP } from '@src/utils/constants/chat.constants'

export default function (io) {
    const namespace = io.of(SOCKET_NAMESPACES.USER_CHAT)
    namespace.use(async (socket, next) => {
        try {
            const accessToken = socket.handshake.auth.accessToken || socket.handshake.headers.accesstoken
            if (!accessToken) return next(new Error('TokenRequiredErrorType'))
            const payLoad = await Jwt.verify(accessToken, config.get('jwt.tokenSecret'))
            const groupId = socket.handshake.auth.group || socket.handshake.headers.group
            // const groupId = GLOBAL_GROUP // for one group
            // if (!groupId) return next(new Error('GroupMissingrErrorType'))
            const findUser = await db.User.findOne({ where: { userId: payLoad.userId, isActive: true }, attributes: ['userId'] })
            if (!findUser) return next(new Error('UserNotExistsErrorType'))

            // const groupJoin = await db.UserChatGroup.findOne({ where: { chatGroupId: groupId, userId: payLoad.userId } })

            // if (!groupJoin || groupJoin.isActive === false) return next(new Error('UserDoesNotJoinedThisGroupErrorType'))
            //     const group = await db.ChatGroup.findOne({ where: { id: groupId } })
            //     if (!group || group.isGlobal === false) return next(new Error('ThisGroupIsNotGlobalErrorType'))
            socket.operator = {
                userId: payLoad.userId,
                groupId: groupId
            }
            next()
        } catch (error) {
            return next(new Error('AuthenticationErrorType'))
        }
    })
    namespace.on('connection', (socket) => {
        socket.join(`${SOCKET_ROOMS.USER_CHAT}:${socket.operator.groupId}`)
        socket.on(SOCKET_LISTENERS.SEND_MESSAGE, ChatHandler.sendMessage)
        socket.on('disconnect', () => {
            socket.leave(`${SOCKET_ROOMS.USER_CHAT}:${socket.operator.groupId}`)
        })
    })
}