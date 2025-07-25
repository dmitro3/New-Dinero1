'use strict'
module.exports = function (sequelize, DataTypes) {
  const PaymentProvider = sequelize.define('PaymentProvider', {
    paymentProviderId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    displayName: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    group: {
      type: DataTypes.STRING
    },
    settings: {
      type: DataTypes.JSONB
    },
    supportsDeposit: {
      type: DataTypes.BOOLEAN
    },
    supportsWithdrawal: {
      type: DataTypes.BOOLEAN
    },
    regions: {
      type: DataTypes.JSONB
    },
    aggregator: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
    category: {
      type: DataTypes.STRING
    },
    amountKeys: {
      type: DataTypes.JSONB
    },
    kycCountries: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    tableName: 'payment_providers',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return PaymentProvider
}
