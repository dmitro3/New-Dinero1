import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import dayjs from 'dayjs'
import { Logger } from './logger'

/**
 * @class BaseHandler
 * A generic base class for handling execution workflows with centralized logging and error management.
 * @property {Object} input - Input parameters for the handler.
 * @property {Object} context - Contextual data (e.g., user session, database transaction).
 * @property {Object} transaction - Database transaction instance.
 */
export class BaseHandler {
  constructor(args = {}, context = {}) {
    this.args = args
    this.context = context
    this.dbTransaction = context.sequelizeTransaction
  }

  static async execute(args = {}, context = {}) {
    const startTime = dayjs()
    const handlerName = this.name.toUpperCase()


    const instance = new this(args, context)

    try {
      Logger.info(`------------------------ ${handlerName} - Execution started -----------------------------`)
      const result = await instance.run()
      const duration = dayjs().diff(startTime)
      Logger.info(`------------------------ ${handlerName} - Execution completed in ${duration} ms -----------------------------`)
      return result
    } catch (error) {
      console.log(error)
      await instance.handleError(error)
    }
  }

  async run() {
    throw new Error('The run() method must be implemented in subclass')
  }

  async handleError(error) {
    const handlerName = this.constructor.name.toUpperCase()
    Logger.error({ error }, `------------------------ ${handlerName} - Execution failed ------------------------`)

    if (this.dbTransaction) {
      try {
        await this.dbTransaction.rollback()
      } catch (rollbackError) {
        Logger.error({ rollbackError }, `------------------------ ${handlerName} - Transaction rollback failed ------------------------`)
      }
    }

    if (error instanceof AppError) {
      throw error
    }

    throw new AppError({
      ...Errors.INTERNAL_ERROR,
      message: error.message || error.description,
      stack: error.stack,
      handler: handlerName,
    })
  }
}
