import { BaseHandler } from '@src/libs/logicBase'
import WalletEmitter from '@src/socket-resources/emmitter/wallet.emmitter'

export class UpdateWalletBalanceHandler extends BaseHandler {
  async run() {
    const {
      Wallet: WalletModel
    } = this.context.dbModels

    const transaction = this.context.sequelizeTransaction
    const { detail } = this.context.req.user

    const userWallet = await WalletModel.findOne({
      where: { ownerId: detail.userId },
      lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
      transaction
    })

    WalletEmitter.emitUserWalletBalance({
      scCoin: (Math.round((+userWallet.scCoin?.psc + +userWallet.scCoin?.bsc + +userWallet.scCoin?.wsc) * 100) / 100).toFixed(2),
      gcCoin: (+userWallet.gcCoin),
      isCredit: true
    }, detail.userId)

    await transaction.commit()

    return { success: true, message: 'Wallet Balance Emitted Successfully!' }
  }
}
