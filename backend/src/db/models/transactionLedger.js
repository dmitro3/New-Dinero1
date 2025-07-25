'use strict'

import { LEDGER_TRANSACTION_TYPES, LEDGER_TYPES } from '@src/utils/constants/public.constants'

module.exports = (sequelize, DataTypes) => {
  const TransactionLedger = sequelize.define('TransactionLedger', {
    ledgerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM(Object.values(LEDGER_TRANSACTION_TYPES)),
      allowNull: false
    },
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wallets',
        key: 'id'
      }
    },
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'currencies',
        key: 'code'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    direction: {
      type: DataTypes.ENUM(Object.values(LEDGER_TYPES)),
      allowNull: false
    }
  }, {
    tableName: 'transaction_ledgers',
    timestamps: true,
    underscored: true
  })

  TransactionLedger.associate = (models) => {
    TransactionLedger.belongsTo(models.Transaction, { foreignKey: 'transactionId', constraints: false, as: 'bankingLedger' })
    TransactionLedger.belongsTo(models.CasinoTransaction, { foreignKey: 'transactionId', constraints: false, as: 'casinoLedger' })
    TransactionLedger.belongsTo(models.Wallet, { foreignKey: 'walletId' })
    TransactionLedger.belongsTo(models.Currency, { foreignKey: 'currencyCode' })
  }

  return TransactionLedger
}
