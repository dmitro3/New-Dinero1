import db from '@src/db/models';
import { AppError } from '@src/errors/app.error';
import { Errors } from '@src/errors/errorCodes';
import { BaseHandler } from '@src/libs/logicBase';
import { MathPrecision } from '@src/libs/mathOperation';
import WalletEmitter from '@src/socket-resources/emmitter/wallet.emmitter';
import { LEDGER_TYPES } from '@src/utils/constants/public.constants';

export class CreateLedgerHandlerHandler extends BaseHandler {
    get constraints() {
        return constraints;
    }

    async run() {
        const { transactionId, transactionType, currencyCode, userId, direction, amount } = this.args;
        const transaction = this.dbTransaction // Initialize local transaction
        const wallet = await db.Wallet.findOne({
            where: { userId, currencyCode },
            lock: true, // Lock row to prevent race conditions
            transaction,
        })

        if (!wallet) {
            throw new AppError(Errors.WALLET_NOT_FOUND);
        }

        // Update wallet balance based on direction
        if (direction === LEDGER_TYPES.CREDIT) {
            wallet.balance = MathPrecision.plus(wallet.balance, amount);
        } else if (direction === LEDGER_TYPES.DEBIT) {
            // Skip balance check for casino transactions as it's already done in CreateCasinoTransactionHandler
            if (transactionType !== 'casino' && wallet.balance < amount) {
                throw new AppError(Errors.INSUFFICIENT_FUNDS);
            }
            wallet.balance = MathPrecision.minus(wallet.balance, amount);
        } else {
            throw new AppError(Errors.INVALID_DIRECTION);
        }

        // Save ledger entry
        const ledger = await db.TransactionLedger.create(
            {
                transactionId,
                transactionType,
                direction,
                amount,
                walletId: wallet.id,
                currencyCode
            },
            { transaction }
        );
        // Save wallet with updated balance
        await wallet.save({ transaction });

        WalletEmitter.emitUserWalletBalance({
            walletId: wallet.id,
            currencyCode,
            balance: wallet.balance,
        }, userId)

        return { ...ledger, updatedBalance: wallet.balance };
    }
}
