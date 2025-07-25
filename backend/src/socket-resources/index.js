import { createAdapter } from '@socket.io/redis-adapter'
import { Server as SocketServer } from 'socket.io'
import i18n from '../libs/i18n'
import Logger from '../libs/logger'
import { redisPublisher, redisSubscriber } from '../libs/redis'
import { getLocalizedError, isTrustedError } from '../utils/error.utils'
import { InternalServerErrorType } from '../utils/errors'
import argumentsDecoratorSocketMiddleware from './middlewares/argumentsDecoratorSocket.middleware'
import contextSocketMiddleware from './middlewares/contextSocket.middleware'
import namespaces from './namespaces'

// TODO: specify the particular origin
const socketCorsOptions = {
  cors: { origin: '*' },
  path: '/api/socket'
}
const socketServer = new SocketServer(socketCorsOptions) // socketCorsOptions
socketServer.on('new_namespace', (namespace) => {
  namespace.use((socket, next) => {
    const req = socket.request

    i18n.init(req)

    socket.on('error', (error) => {
      if (isTrustedError(error)) {
        socket.emit('error', { data: {}, errors: [getLocalizedError(error, socket.request.__)] })
      } else {
        Logger.error(
          (error.name || InternalServerErrorType.name),
          {
            message: error.message || error.description,
            fault: error.fields
          })
        socket.emit('error', { data: {}, errors: [getLocalizedError(InternalServerErrorType, socket.request.__)] })
      }
    })

    socket.use(argumentsDecoratorSocketMiddleware(socket))
    socket.use(contextSocketMiddleware(socket))

    next()
  })
})

socketServer.adapter(createAdapter(redisPublisher, redisSubscriber))

namespaces(socketServer)

export default socketServer
