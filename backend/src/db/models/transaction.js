
'use strict'

const { TRANSACTION_PURPOSE } = require("@src/utils/constants/public.constants")
const { TRANSACTION_STATUS, PAYMENT_PROVIDER } = require("@src/utils/constant")

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        transactionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            refrences: {
                model: 'users',
                key: 'user_id'
            }
        },
        paymentProviderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        paymentProvider: {
            type: DataTypes.ENUM(Object.values(PAYMENT_PROVIDER)),
            allowNull: true
        },
        withdrawalId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        purpose: {
            type: DataTypes.ENUM(Object.values(TRANSACTION_PURPOSE)),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(Object.values(TRANSACTION_STATUS)),
            defaultValue: TRANSACTION_STATUS.PENDING,
            allowNull: true,
        },
        moreDetails: {
            type: DataTypes.JSONB(),
            allowNull: true,
        }
    }, {
        tableName: 'transactions',
        timestamps: true,
        underscored: true
    })

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, { foreignKey: 'userId' })
        Transaction.belongsTo(models.TransactionLedger, { foreignKey: 'transactionId', as: 'bankingLedger' })
        Transaction.belongsTo(models.WithdrawalRequest, {
            foreignKey: "withdrawalId",
            as: 'withdrawalTransaction', onDelete: "cascade"
        })
    }

    return Transaction
}