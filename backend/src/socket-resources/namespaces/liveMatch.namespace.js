import { SOCKET_NAMESPACES } from '@src/utils/constants/socket.constant'
import contextSocketMiddleware from '../middlewares/contextSocket.middleware'
import requestValidationSocketMiddleware from '../middlewares/requestValidationSocket.middleware'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.LIVE_MATCH)
  namespace.on('disconnect', (socket) => {
    global.number--
  })
  namespace.on('connection', (socket) => {
    global.number++
    socket.use(contextSocketMiddleware(socket || {}))
    socket.use(requestValidationSocketMiddleware)
  })
}
