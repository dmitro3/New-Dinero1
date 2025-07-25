import config from '@src/configs/app.config'
import { setCache } from '@src/libs/redis'
import { JWT_TOKEN_TYPES } from '@src/utils/constant'
import jwt from 'jsonwebtoken'

export const createAccessToken = async (user) => {
    const accessToken = jwt.sign({
        userId: user.userId,
        username: user.username,
        type: JWT_TOKEN_TYPES.LOGIN
    },
        config.get('jwt.tokenSecret'), {
        expiresIn: +config.get('jwt.tokenExpiry') * 100
    })
    await setCache(`${user.userId}:ACCESS_TOKEN`, accessToken, +config.get('jwt.tokenExpiry') * 100)
    return accessToken
}