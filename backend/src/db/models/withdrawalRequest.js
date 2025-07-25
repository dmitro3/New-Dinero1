'use strict'

const { DataTypes } = require('sequelize')
import { WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants'

module.exports = (sequelize) => {
  const WithdrawalRequest = sequelize.define(
    'WithdrawalRequest',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(Object.values(WITHDRAWAL_STATUS)),
        allowNull: false,
        defaultValue: WITHDRAWAL_STATUS.PENDING
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'withdrawl currency'
      },
      withdrawalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'withdrawl wallet address of currency'
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      confirmedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      paymentProvider: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // paymentMetadata: {
      //   type: DataTypes.JSONB, // Use JSONB to store provider-specific data
      //   allowNull: true,
      //   comment: 'Provider-specific metadata like transactionId, status, etc.'
      // },
      comment: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'withdrawal_requests',
      timestamps: true,
      underscored: true
    }
  )

  WithdrawalRequest.associate = (models) => {
    WithdrawalRequest.belongsTo(models.User, { foreignKey: 'userId' })
    WithdrawalRequest.hasMany(models.Transaction, { foreignKey: 'withdrawalId', onDelete: 'cascade', })
  }

  return WithdrawalRequest
}
