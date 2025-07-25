
import { SOCKET_NAMESPACES, SOCKET_ROOMS } from '@src/utils/constants/socket.constant'
import contextSocketMiddleware from '../middlewares/contextSocket.middleware'
import requestValidationSocketMiddleware from '../middlewares/requestValidationSocket.middleware'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
global.number |= 0
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.LEADER_BOARD)
  namespace.on('disconnect', (socket) => {
    global.number--
  })
  namespace.on('connection', (socket) => {
    global.number++
    socket.use(contextSocketMiddleware(socket || {}))
    socket.use(requestValidationSocketMiddleware)
    socket.join(SOCKET_ROOMS.LEADER_BOARD)
  })
}
