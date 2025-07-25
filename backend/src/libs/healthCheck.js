import db from '@src/db/models'
import Logger from '@src/libs/logger'
import { client } from '@src/libs/redis'
import { ERRORS } from '@src/utils/errors'
import { SUCCESS_MSG } from '@src/utils/success'

export default async () => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: ERRORS.SERVICE_FAILED,
    cache: ERRORS.SERVICE_FAILED,
    search: ERRORS.SERVICE_FAILED,
    server: SUCCESS_MSG.HEALTHCHECK_SUCCESS
  }

  try {
    await db.sequelize.authenticate()

    healthCheck.database = SUCCESS_MSG.HEALTHCHECK_SUCCESS
  } catch (error) {
    Logger.error(SUCCESS_MSG.METHOD, { message: error.message })
  }

  try {
    const redisResponse = await client.ping()
    if (redisResponse !== SUCCESS_MSG.REDIS_SUCCESS) {
      throw new Error(ERRORS.CACHE_FAILED)
    }

    healthCheck.cache = SUCCESS_MSG.HEALTHCHECK_SUCCESS
  } catch (error) {
    Logger.error(SUCCESS_MSG.METHOD, { message: error.message })
  }

  return healthCheck
}
