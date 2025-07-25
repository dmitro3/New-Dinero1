import { v4 as uuid } from 'uuid'
import models, { sequelize } from '@src/db/models'
import Logger from '@src/libs/logger'
import responseValidationSocketMiddleware from './responseValidationSocket.middleware'
import db from '@src/db/models'

/**
 * A Socket Request Data type
 * @typedef {Object} SocketRequestData
 * @property {Object} payload
 * @property {SocketContext} context
 */

/**
 * A Socket Request Response Schema
 * @typedef {Object} SocketSchemas
 * @property {import('ajv').ValidateFunction} request
 * @property {import('ajv').ValidateFunction} response
 */

/**
 * A Socket Context Data type
 * @typedef {Object} SocketContext
 * @property {import('socket.io').Socket} socket
 * @property {string} traceId
 * @property {import('sequelize')} sequelize
 * @property {Object} dbModels
 * @property {Logger} logger
 * @property {SocketSchemas} schemas
 */

/**
 *
 *
 * @export
 * @param {import('socket.io').Socket} socket
 * @param {SocketSchemas} socketSchemas
 * @return {*}
 */
export default function contextSocketMiddleware (socket, socketSchemas = {}) {
  return async function (args, next) {
    const [event, payload, callback] = args

    const context = {}
    context.schemas = socketSchemas[event] || {}
    context.socket = socket
    context.msgTimeStamp = Date.now()
    context.traceId = uuid()
    context.sequelize = sequelize
    context.dbModels = models
    context.logger = Logger
    context.sequelizeTransaction = await db.sequelize.transaction()
    args[1] = { payload, context }
    args[2] = responseValidationSocketMiddleware.bind(null, context, event, callback)
    next()
  }
}
