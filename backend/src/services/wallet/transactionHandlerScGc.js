import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { LEDGER_DIRECTIONS, LEDGER_TRANSACTION_TYPES } from '@src/utils/constants/public.constants'
import { CreateLedgerHandlerHandler } from './createLedgerHandler'


export class TransactionScGcHandler extends BaseHandler {
  get constraints() {
    return constraints
  }

  async run() {
    const {
      adminId, userId, coinData = [], status, purpose, paymentProvider, moreDetails
    } = this.args
    const transaction = this.dbTransaction
    try {
      const transactionData = {}
      if (paymentProvider) transactionData.paymentProviderId = paymentProvider
      if (moreDetails) transactionData.moreDetails = moreDetails
      if (status) transactionData.status = status
      if (adminId) transactionData.actioneeId = adminId

      const bankingTransaction = await db.Transaction.create({
        userId,
        purpose: purpose,
        ...transactionData
      }, { transaction })

      const ledger = await Promise.all(
        coinData.map((coin) =>
          CreateLedgerHandlerHandler.execute({
            transactionId: bankingTransaction.transactionId,
            transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
            currencyCode: coin.currencyCode,
            userId,
            direction: LEDGER_DIRECTIONS[purpose],
            amount: coin.amount
          }, this.context)
        )
      )



      return { transaction: { ...bankingTransaction, ledger } }
    } catch (error) {
      throw new AppError({ ...Errors.INTERNAL_ERROR, message: error })
    }
  }
}