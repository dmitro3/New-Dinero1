import db from '@src/db/models'
import { closeConnections } from '@src/libs/redis'
import { Logger } from './logger'

export default async function gracefulShutDown (signal) {
  try {
    await db.sequelize.close()
    closeConnections()
    Logger.info('verbose', `Received ${signal}`)
  } catch (error) {
    Logger.error('Error occurred while closing the Database server connection', { message: error })
  }
  process.exit(0)
}
