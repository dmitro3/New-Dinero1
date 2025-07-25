import config from '@src/configs/app.config'
import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { getCache } from '@src/libs/redis'

import { JWT_TOKEN_TYPES } from '@src/utils/constant'
import Jwt from 'jsonwebtoken'

export async function isUserAuthenticated(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split('Bearer ')[1]
    if (!accessToken) return next(new AppError(Errors.INVALID_TOKEN))

    const decodedToken = Jwt.verify(accessToken, config.get('jwt.tokenSecret'))
    if (decodedToken.type !== JWT_TOKEN_TYPES.LOGIN) return next(new AppError(Errors.INVALID_TOKEN))
    const token = await getCache(`${decodedToken.userId}:ACCESS_TOKEN`)
    // if (token !== accessToken) return next(new AppError(Errors.INVALID_TOKEN))

    const user = await db.User.findOne({
      where: { userId: decodedToken.userId, isActive: true },
      attributes: ['username', 'userId'],
      transaction: req.context?.sequelizeTransaction
    })
    if (!user) next(new AppError(Errors.INVALID_TOKEN))
    req.body.userId = decodedToken.userId
    req.query.userId = decodedToken.userId
    req.body.username = decodedToken?.username

    next()
  } catch (error) {
    console.log(error)
    next(new AppError(Errors.INVALID_TOKEN))
  }
}


export async function semiAuth(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split('Bearer ')[1]
    if (accessToken) {
      await isUserAuthenticated(req, res, (err) => {
        if (err) {
          throw err
        }
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    next(new AppError(Errors.INVALID_TOKEN))
  }
}
