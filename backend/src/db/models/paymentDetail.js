'use strict'

module.exports = function (sequelize, DataTypes) {
  const PaymentDetail = sequelize.define('PaymentDetail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'e.g., Mastercard, Visa, Swisscard, Google, Apple, etc.'
    },
    lastFourDigits: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hasCheckoutPermission: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    hasWithdrawalPermission: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    achAccessToken: {
      type: DataTypes.STRING,
      default: true,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'payment_details',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: false
  })

  PaymentDetail.associate = function (models) {
    PaymentDetail.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    })
  }

  return PaymentDetail
}
