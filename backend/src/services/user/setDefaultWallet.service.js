import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class SetDefaultWalletHandler extends BaseHandler {
  async run () {
    const walletId = this.args.walletId
    const userId = this.args.userId
    const transaction = this.context.sequelizeTransaction
  
      const wallet = await db.Wallet.findOne({ where: { walletId, ownerId: userId }, transaction })
      if (!wallet) throw new AppError(Errors.WALLET_NOT_FOUND)

      await db.Wallet.update({ isPrimary: false }, { where: { ownerId: userId, isPrimary: true }, transaction })
      await db.Wallet.update({ isPrimary: true }, { where: { walletId, ownerId: userId }, transaction })

      return { success: true }
   
  }
}
