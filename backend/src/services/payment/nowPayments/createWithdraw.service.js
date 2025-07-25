
import config from "@src/configs/app.config";
import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import {
  GLOBAL_SETTING,
  PAYMENT_PROVIDER,
} from "@src/utils/constant";
import axios from "axios";
import { GetAuthenticationTokenService } from "./getAuthToken.service";
import {
  COINS,
  TRANSACTION_PURPOSE as LEDGER_PURPOSE,
  WALLET_OWNER_TYPES,
} from "@src/utils/constants/public.constants";

import { ValidateWalletAddress } from "./validateAddress.service";
import { TransactionHandlerHandler as TransactionHandlerService, CreateWithdrawRequestHandler as CreateWithdrawRequestService } from "@src/services/wallet";
import { NOWPAYMENT_WEBHOOK_REDEEM_STATUS, NOWPAYMENT_WEBHOOK_STATUS } from "@src/utils/constants/payment.constants";
import { GetCurrencyConversionService } from "./getConversion.service";

export class WithdrawAmountService extends BaseHandler {
  async run() {
    const { address, currency, userId, amount } = this.args;
    const transaction = this.context.sequelizeTransaction;

    const wallet = await db.Wallet.findOne({
      where: {
        ownerId: userId,
        ownerType: WALLET_OWNER_TYPES.USER,
        currencyCode: COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
      },
      transaction,
    });
    if (wallet.balance < amount) throw new AppError(Errors.INSUFFICIENT_REDEEMABLE_FUNDS);
    const validAddress = await ValidateWalletAddress.execute({
      address,
      currency,
    });

    if (!validAddress) throw new AppError(Errors.INVALID_CRYPTO_ADDRESS);

    const estimatedAmount = +await GetCurrencyConversionService.execute({ amount, convertFrom: 'usd', convertTo: currency })
    // checking the redeem limit for direct redeem
    const redeemSetting = await db.GlobalSetting.findOne({
      where: { key: GLOBAL_SETTING.REDEEM_SETTING },
      transaction
    })

    if (!redeemSetting)
      throw new AppError(Errors.INTERNAL_ERROR)
    console.log('!!!!!!!!!!$$$$$$$$$$%%%%%', redeemSetting)
    const redeemLimits = redeemSetting.value;

    if (amount < redeemLimits.minRedeemAmount)
      throw new AppError(Errors.INVALID_AMOUNT)


    const makeTransaction = await TransactionHandlerService.execute(
      {
        userId,
        fromWalletOwnerId: userId,
        fromWalletOwnerType: WALLET_OWNER_TYPES.USER,
        toWalletOwnerId: 1,
        toWalletOwnerType: WALLET_OWNER_TYPES.ADMIN,
        amount: +amount,
        currencyCode: COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
        purpose: LEDGER_PURPOSE.REDEEM,
        paymentProvider: PAYMENT_PROVIDER.NOWPAYMENT
      },
      this.context)

    const { transaction: redeemTransaction } = makeTransaction

    // creating a redeem request if amount cross the auto redeem limit
    if (amount > redeemLimits.maxAutoRedeemAmount) {

      const withdrawal = await CreateWithdrawRequestService.execute({
        amount,
        userId,
        address,
        currency,
        paymentProvider: PAYMENT_PROVIDER.NOWPAYMENT
      }, this.context)

      const { withdrawalRequest: redeemRequest } = withdrawal
      redeemTransaction.withdrawalId = redeemRequest.id
      await redeemTransaction.save({ transaction })
      return { success: true, message: 'Redeem request successfully created' }
    }

    // Make payout
    const { result: token } = await GetAuthenticationTokenService.execute();

    console.log('1!!!!!!!!!!!!!!################$', address, amount, currency, config.get('app.userBackendUrl'), token.token)
    const response = await axios({
      method: 'POST',
      url: config.get('nowPayment.url') + '/v1/payout',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'x-api-key': config.get('nowPayment.apiKey'),
        'Content-Type': 'application/json'
      },
      data: {
        ipn_callback_url: config.get('app.userBackendUrl') + '/api/v1/payment/get-payment-status',
        withdrawals: [
          {
            address,
            currency,
            amount: parseFloat(estimatedAmount.toFixed(6)),
            ipn_callback_url: config.get('app.userBackendUrl') + '/api/v1/payment/get-payment-status'
          }
        ]
      }
    })
    console.log('1!!!!!!!!!!!!!###########^%^^^^^', response)
    const data = response.data?.withdrawals || [];
    // const data =
    //   [{
    //     is_request_payouts: false,
    //     id: '5003084275',
    //     address: 'TBzLAr7idxfypvCMktdMuiJJiQmFbXnXzd',
    //     currency: 'usdttrc20',
    //     amount: '50',
    //     ipn_callback_url: 'https://api-dev.casinokai.us/api/v1/payment/get-payment-status',
    //     batch_withdrawal_id: '5002549981',
    //     status: 'CREATING',
    //     error: null,
    //     extra_id: null,
    //     hash: null,
    //     payout_description: null,
    //     unique_external_id: null,
    //     created_at: '2025-02-25T09:47:55.647Z',
    //     requested_at: null,
    //     updated_at: null,
    //     update_history_log: null,
    //     rejected_check_attempts: 0,
    //     fee: null,
    //     fee_paid_by: null
    //   }];


    if (data.length) {
      for (const withdraws of data) {
        if (withdraws.status === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.REJECTED || withdraws.status === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.FAILED)
          throw new AppError({ ...Errors.PAYMENT_FAILED, error: withdraws.status })
        // redeemRequest.status = WITHDRAWAL_STATUS.SUCCESS
        redeemTransaction.providerPaymentId = withdraws.id
        redeemTransaction.moreDetails = { ...withdraws }
        await redeemTransaction.save({ transaction })
      }
    }
    return { success: true, message: "Processing redeem" };
  }
  catch(error) {
    throw new AppError(Errors.INTERNAL_SERVER_ERROR);
  }
}
