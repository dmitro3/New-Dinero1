import db from "@src/db/models";
// import { AMOUNT_TYPE, PAYMENT_PROVIDER, TRANSACTION_STATUS, TRANSACTION_TYPE } from '@src/utils/constant'
import { dayjs } from '@src/libs/dayjs';
import { BaseHandler } from "@src/libs/logicBase";
import { calculatePurchasedCoins } from "@src/services/helper/payment";
import { CreateLedgerHandlerHandler } from "@src/services/wallet";
import { ClaimDepositBonusHandler } from "@src/services/bonus/depositBonus/claimDepositBonus.handler";
import { AddUserTierProgressHandler } from '@src/services/userTierProgress'

import {
  PAYMENT_PROVIDER,
  TRANSACTION_STATUS
} from "@src/utils/constant";
import {
  NOWPAYMENT_WEBHOOK_MAPPING,
  NOWPAYMENT_WEBHOOK_REDEEM_STATUS,
  NOWPAYMENT_WEBHOOK_STATUS,
} from "@src/utils/constants/payment.constants";
import {
  COINS,
  LEDGER_DIRECTIONS,
  LEDGER_TRANSACTION_TYPES,
  TRANSACTION_PURPOSE,
  WITHDRAWAL_STATUS
} from "@src/utils/constants/public.constants";
import { GetCurrencyConversionService } from "./getConversion.service";

export class GetPaymentIPNService extends BaseHandler {
  async run() {
    const {
      id,
      payment_status,
      payment_id,
      order_id,
      pay_address,
      price_amount,
      pay_amount,
      pay_currency,
      outcome_amount,
      actually_paid_at_fiat,
      actually_paid,
      status,
      amount,
    } = this.args;
    const transaction = this.context.sequelizeTransaction;
    // purchase/payment case
    if (order_id || payment_id) {
      if (
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.WAITING ||
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.CONFIRMING ||
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.SENDING
      ) {
        return { success: true, message: "Status Ignored" };
      }

      const userId = order_id.split("-")[1];
      const packageId = order_id.split("-")[2];

      const user = await db.User.findOne({
        where: { userId },
        transaction,
      });
      if (!user) return { success: false, message: "User Not Exists" };

      let checkTransaction = await db.Transaction.findOne({
        where: {
          paymentProviderId: payment_id.toString(),
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

        return { status: 200, message: "Transaction already processed." };
      }

      if (!checkTransaction) {

        checkTransaction = await db.Transaction.create(
          {
            userId: userId,
            // actioneeId: userId,
            purpose: TRANSACTION_PURPOSE.PURCHASE,
            // actioneeType: WALLET_OWNER_TYPES.USER,
            paymentProviderId: payment_id.toString(),
            status: NOWPAYMENT_WEBHOOK_MAPPING[payment_status],
            paymentProvider: PAYMENT_PROVIDER.NOWPAYMENT,
            moreDetails: { ...this.args },
          },
          { transaction }
        );

      } else {
        checkTransaction.status = NOWPAYMENT_WEBHOOK_MAPPING[payment_status];
        await checkTransaction.save({ transaction });

      }
      if (
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.PARTIALLY_PAID ||
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.FINISHED ||
        payment_status === NOWPAYMENT_WEBHOOK_STATUS.CONFIRMED
      ) {
        checkTransaction.status = TRANSACTION_STATUS.SUCCESS;

        const packageDetails = await db.Package.findOne({
          where: { id: packageId },
          transaction,
        });

        const estimatedAmount = await GetCurrencyConversionService.execute({ amount: actually_paid, convertFrom: pay_currency, convertTo: 'usd' })
        const { gcCoins, scCoins } = calculatePurchasedCoins({
          gc: packageDetails.gcCoin,
          sc: packageDetails.scCoin,
          amount: packageDetails.amount,
          // amountPaid:
          //   payment_status === NOWPAYMENT_WEBHOOK_STATUS.PARTIALLY_PAID
          //     ? actually_paid_at_fiat
          //     : price_amount,
          amountPaid: estimatedAmount
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
      } else {
        checkTransaction.status = NOWPAYMENT_WEBHOOK_MAPPING[payment_status];
        checkTransaction.save({ transaction });
      }
    } else if (id) {
      // Redeem case

      if (
        status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.WAITING.toLowerCase() ||
        status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.SENDING.toLowerCase() ||
        status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.PROCESSING.toLowerCase() ||
        status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.CREATING.toLowerCase() ||
        status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.EXPIRED.toLowerCase()
      ) {
        return { success: true, message: "Status Ignored" };
      }

      const paymentTransaction = await db.Transaction.findOne({
        where: { paymentProviderId: id.toString() },
        transaction,
      });
      if (!paymentTransaction) {
        return { status: 200, message: "Withdraw ID do not exists." };
      }
      const userId = paymentTransaction.userId;

      if (
        status.trim().toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.FAILED.trim().toLowerCase() ||
        status.trim().toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.REJECTED.trim().toLowerCase()

      ) {

        await CreateLedgerHandlerHandler.execute(
          {
            transactionId: paymentTransaction.transactionId,
            transactionType: LEDGER_TRANSACTION_TYPES.WITHDRAW,
            userId: userId,
            direction: LEDGER_DIRECTIONS[TRANSACTION_PURPOSE.REDEEM_REFUND],
            currencyCode: COINS.SWEEP_COIN.REDEEMABLE_SWEEP_COIN,
            amount,
          },
          this.context
        );
      }

      if (status.toLowerCase() === NOWPAYMENT_WEBHOOK_REDEEM_STATUS.FINISHED.toLowerCase()) {
        paymentTransaction.status = TRANSACTION_STATUS.SUCCESS
        await paymentTransaction.save({ transaction });
        await db.WithdrawalRequest.update({ status: WITHDRAWAL_STATUS.SUCCESS, confirmedAt: dayjs() }, {
          where:
          {
            id: paymentTransaction.withdrawalId,
            userId: paymentTransaction.userId
          },
          transaction
        })
      } else {

        paymentTransaction.status = TRANSACTION_STATUS.FAILED
        await paymentTransaction.save({ transaction });

      }

    }

    return { success: true };
  }
}