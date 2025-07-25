import config from '@src/configs/app.config'
import db from '@src/db/models'
import { Errors } from '@src/errors/errorCodes'
import Logger from '@src/libs/logger'
import jwt from 'jsonwebtoken'
import { error } from 'winston'

export default async function authenticationSocketNamespaceMiddleWare(socket, next) {
  try {
    const accessToken = socket.handshake.headers.accessToken
    if (!accessToken) {
      next(Errors.INVALID_TOKEN)
    }
    const payLoad = await jwt.verify(accessToken, config.get('jwt.tokenSecret'))

    // const isTokenExistInRedis = await socketServer.redisClient.get(`user:${payLoad.uuid}`)

    // if (isTokenExistInRedis !== accessToken) {
    //   return next(InvalidTokenErrorType)
    // }

    const findUser = await db.User.findOne({
      where:
        { userId: payLoad.id }
    })
    if (!findUser) {
      return next(Errors.USER_NOT_EXISTS)
    }

    const operator = {}
    operator.userId = payLoad.id
    socket.operator = operator

    next()
  } catch (err) {
    Logger.error('Error in authenticationSocketMiddleware', {
      message: err.message,
      context: socket.handshake,
      exception: err
    })
    return next(error)
  }
}
