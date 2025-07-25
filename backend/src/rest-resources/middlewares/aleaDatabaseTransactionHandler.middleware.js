import db from '@src/db/models'
import _ from 'lodash'
/**
 * This middleware handles database transaction automatically,
 * Include this middleware in your route if you want to include transactions in database queries
 * @type {import('express').Handler}
 */
export async function aleaDatabaseTransactionHandlerMiddleware (req, res, next) {
  req.context.sequelizeTransaction = await db.sequelize.transaction()
  const onFinishAndClose = async () => {
    if (~['commit', 'rollback'].indexOf(req.context.sequelizeTransaction.finished)) {
      return
    }

    if (~['4', '5'].indexOf(res.statusCode) || _.size(res.payload?.errors) || !res.payload || res.payload.statusCode) {
      console.log(res.payload)
      await req.context.sequelizeTransaction.rollback()
      return
    }

    await req.context.sequelizeTransaction.commit()
  }

  res.on('finish', onFinishAndClose)
  res.on('close', onFinishAndClose)
  res.on('prefinish', onFinishAndClose)

  next()
}
