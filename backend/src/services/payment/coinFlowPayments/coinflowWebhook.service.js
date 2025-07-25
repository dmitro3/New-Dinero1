import { BaseHandler } from '@src/libs/logicBase'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import db from '@src/db/models'
import { Logger } from '@src/libs/logger'
import { COIN_FLOW_WEBHOOK_STATUS, COIN_FLOW_WEBHOOK_MAPPING } from '@src/utils/constants/payment.constants' // optional async queue
import { GetCoinFlowUserWithdrawalAccountsService } from '@src/services/payment'
import {
  PAYMENT_PROVIDER,
  TRANSACTION_STATUS
} from "@src/utils/constant";
import {
  COINS,
  LEDGER_DIRECTIONS,
  LEDGER_TRANSACTION_TYPES,
  TRANSACTION_PURPOSE,
  WITHDRAWAL_STATUS
} from "@src/utils/constants/public.constants";
import { calculatePurchasedCoins } from "@src/services/helper/payment";
import { CreateLedgerHandlerHandler } from "@src/services/wallet";
import { ClaimDepositBonusHandler } from "@src/services/bonus/depositBonus/claimDepositBonus.handler";
import { AddUserTierProgressHandler } from '@src/services/userTierProgress'
import config from '@src/configs/app.config'


export class CoinflowWebhookService extends BaseHandler {
  async run () {
    const { eventType, data, created, authHeader, category } = this.args
    const transaction = this.context.sequelizeTransaction;
    // const authHeader = this.req.get('Authorization')
    //Use your Webhook Validation Key to validate webhooks for all purchase events
    console.log("================ approvely webhook ==============", this.args)
    if (authHeader !== config.get('coinFlow.authHeader')) {
      throw new AppError(Errors.UN_AUTHORIZE)
      // return { status: 401, success: false }
    }
    if (category === 'Purchase') {
      const paymentId = data?.id
      const orderId = data?.webhookInfo?.orderId
      const userId = data?.webhookInfo?.userId
      const packageId = data?.webhookInfo?.packageId
      const paymentType = data?.webhookInfo?.paymentType

      const orderDetails = await db.ApprovelyPaymentOrder.findOne({ where: { userId, orderId } }, transaction)

      if (!orderDetails) {
        return { status: 400, success: false }
      }

      if (paymentType !== orderDetails.paymentType) {
        return { status: 400, success: false }
      }


      if (eventType === COIN_FLOW_WEBHOOK_STATUS.SETTLED) {



        const user = await db.User.findOne({
          where: { userId },
          transaction,
        });
        if (!user) return { success: false, message: "User Not Exists" };

        let checkTransaction = await db.Transaction.findOne({
          where: {
            paymentProviderId: paymentId.toString(),
            userId: userId,
            // actioneeId: userId,
            // actioneeType: WALLET_OWNER_TYPES.USER,
          },
          attributes: [
            "transactionId",
            "paymentProviderId",
            "status",
            "userId",
            // "actioneeType",
          ],
          transaction,
        });
        if (
          checkTransaction &&
          (checkTransaction.dataValues.status).trim().toLowerCase() === TRANSACTION_STATUS.SUCCESS.trim().toLowerCase()
        ) {

          return { status: 200, success: true, message: "Transaction already processed." };
        }

        if (!checkTransaction) {

          checkTransaction = await db.Transaction.create(
            {
              userId: userId,
              // actioneeId: userId,
              purpose: TRANSACTION_PURPOSE.PURCHASE,
              // actioneeType: WALLET_OWNER_TYPES.USER,
              paymentProviderId: paymentId.toString(),
              status: TRANSACTION_STATUS.SUCCESS,
              paymentProvider: PAYMENT_PROVIDER.APPROVELY,
              moreDetails: { ...this.args },
            },
            { transaction }
          );

        } else {
          checkTransaction.status = TRANSACTION_STATUS.SUCCESS;
          await checkTransaction.save({ transaction });

        }
        // if (
        //     payment_status === NOWPAYMENT_WEBHOOK_STATUS.PARTIALLY_PAID ||
        //     payment_status === NOWPAYMENT_WEBHOOK_STATUS.FINISHED ||
        //     payment_status === NOWPAYMENT_WEBHOOK_STATUS.CONFIRMED
        // ) {
        checkTransaction.status = TRANSACTION_STATUS.SUCCESS;

        const packageDetails = await db.Package.findOne({
          where: { id: packageId },
          transaction,
        });

        // const estimatedAmount = await GetCurrencyConversionService.execute({ amount: actually_paid, convertFrom: pay_currency, convertTo: 'usd' })

        const { gcCoins, scCoins } = calculatePurchasedCoins({
          gc: packageDetails.gcCoin,
          sc: packageDetails.scCoin,
          amount: packageDetails.amount,
          // amountPaid:
          //   payment_status === NOWPAYMENT_WEBHOOK_STATUS.PARTIALLY_PAID
          //     ? actually_paid_at_fiat
          //     : price_amount,
          amountPaid: data.subtotal.cents / 100
        });
        // calling service for purchase bonus if any available
        await ClaimDepositBonusHandler.execute(
          {
            scCoins: scCoins, gcCoins: gcCoins, userId,
            // purchaseAmount: estimatedAmount
          },
          this.context
        );

        // }

        await CreateLedgerHandlerHandler.execute(
          {
            transactionId: checkTransaction.transactionId,
            transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
            userId: userId,
            direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.PURCHASE],
            currencyCode: COINS.SWEEP_COIN.PURCHASE_SWEEP_COIN,
            amount: scCoins,
          },

          this.context
        );

        await AddUserTierProgressHandler.execute({
          userId: userId,
          depositsThreshold: scCoins
        }, this.context)

        await CreateLedgerHandlerHandler.execute(
          {
            transactionId: checkTransaction.transactionId,
            transactionType: LEDGER_TRANSACTION_TYPES.BANKING,
            userId: userId,
            direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.PURCHASE],
            currencyCode: COINS.GOLD_COIN,
            amount: gcCoins,
          },
          this.context
        );


        await checkTransaction.save({ transaction });
        await orderDetails.update({
          status: eventType
        })

        return { status: 200, success: true }
        // }
      } else {



        const user = await db.User.findOne({
          where: { userId },
          transaction,
        });
        if (!user) return { success: false, message: "User Not Exists" };

        let checkTransaction = await db.Transaction.findOne({
          where: {
            paymentProviderId: paymentId.toString(),
            userId: userId,
            // actioneeId: userId,
            // actioneeType: WALLET_OWNER_TYPES.USER,
          },
          attributes: [
            "transactionId",
            "paymentProviderId",
            "status",
            "userId",
            // "actioneeType",
          ],
          transaction,
        });
        if (
          checkTransaction &&
          (checkTransaction.dataValues.status).trim().toLowerCase() === TRANSACTION_STATUS.SUCCESS.trim().toLowerCase()
        ) {

          return { status: 200, success: true, message: "Transaction already processed." };
        }

        if (!checkTransaction) {

          checkTransaction = await db.Transaction.create(
            {
              userId: userId,
              // actioneeId: userId,
              purpose: TRANSACTION_PURPOSE.PURCHASE,
              // actioneeType: WALLET_OWNER_TYPES.USER,
              paymentProviderId: paymentId.toString(),
              status: COIN_FLOW_WEBHOOK_MAPPING[eventType],
              paymentProvider: PAYMENT_PROVIDER.APPROVELY,
              moreDetails: { ...this.args },
            },
            { transaction }
          );

        } else {
          checkTransaction.status = COIN_FLOW_WEBHOOK_MAPPING[eventType];
          await checkTransaction.save({ transaction });

        }
        checkTransaction.status = COIN_FLOW_WEBHOOK_MAPPING[eventType];
        checkTransaction.save({ transaction });
        await orderDetails.update({
          status: eventType
        })

        return { status: 200, success: true }

      }

    } else if (category === 'KYC') {




      const { wallet } = data || {}
      const message = eventType?.trim()

      if (!wallet || !message) {
        return { status: 400, success: false, message: 'Invalid KYC data' }
      }

      // Extract userId from wallet string after the special character "ʬ"
      const parts = wallet.split('ʬ')
      if (parts.length < 2) {
        return { status: 400, success: false, message: 'Invalid wallet format for extracting userId' }
      }

      // const userId = parseInt(parts[1], 10)
      const userId = Number(parts[1])
      if (isNaN(userId)) {
        return { status: 400, success: false, message: 'Invalid userId extracted from wallet' }
      }

      const userDetails = await db.UserDetails.findOne({
        where: { userId },
        transaction
      })

      if (!userDetails) {
        return { status: 404, success: false, message: 'User details not found' }
      }

      // Map message to status
      let statusToSet = null
      if (message === 'KYC Created') {
        statusToSet = 'pending'
      } else if (message === 'KYC Success') {
        statusToSet = 'success'
      } else if (message === 'KYC Failure') {
        statusToSet = 'failed'
      } else {
        return { status: 400, success: false, message: 'Unknown KYC status' }
      }

      // Update coinflowKycStatus
      userDetails.coinflowKycStatus = statusToSet
      await userDetails.save({ transaction })

      // On success, fetch user withdrawal accounts
      if (message === 'KYC Success') {
        await GetCoinFlowUserWithdrawalAccountsService.execute({ userId })
      }

      return { status: 200, success: true, message: 'KYC status processed' }

    } else if (category === 'Withdraw') {
      const signature = data?.signature;

      if (!signature) {
        return { status: 400, success: false, message: 'Missing signature in withdraw webhook' };
      }

      const transactionRecord = await db.Transaction.findOne({
        where: { paymentProviderId: signature },
        transaction,
      });

      if (!transactionRecord) {
        return { status: 200, success: true, message: 'No transaction found for signature, ignoring.' };
      }

      const userId = transactionRecord.userId;
      const withdrawalId = transactionRecord.withdrawalId;

      const withdrawal = await db.WithdrawalRequest.findOne({
        where: {
          id: withdrawalId,
          userId
        },
        transaction
      });

      if (!withdrawal) {
        return { status: 200, success: true, message: 'Withdrawal record not found, skipping.' };
      }

      if (eventType === 'Withdraw Pending') {
        // Optional: track if you want to log intermediary state
        return { status: 200, success: true, message: 'Withdraw Pending received, no action needed.' };
      }

      if (eventType === 'Withdraw Success') {
        transactionRecord.status = TRANSACTION_STATUS.SUCCESS;
        await transactionRecord.save({ transaction });

        withdrawal.status = WITHDRAWAL_STATUS.SUCCESS;
        withdrawal.confirmedAt = created;
        await withdrawal.save({ transaction });

        return { status: 200, success: true, message: 'Withdrawal marked as successful' };
      }

      if (eventType === 'Withdraw Failure') {
        // Refund back coins
        const amount = withdrawal.amount;

        await CreateLedgerHandlerHandler.execute(
          {
            transactionId: transactionRecord.transactionId,
            transactionType: LEDGER_TRANSACTION_TYPES.WITHDRAW,
            userId: userId,
            direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.REDEEM_REFUND],
            currencyCode: COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
            amount,
          },
          this.context
        );

        transactionRecord.status = TRANSACTION_STATUS.FAILED;
        await transactionRecord.save({ transaction });

        withdrawal.status = WITHDRAWAL_STATUS.CANCELLED;
        await withdrawal.save({ transaction });

        return { status: 200, success: true, message: 'Withdrawal marked as failed and refunded' };
      }

      return { status: 200, success: true, message: 'Withdraw event ignored' };
    }

  }

}
