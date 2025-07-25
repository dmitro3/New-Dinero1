'use strict'

module.exports = function (sequelize, DataTypes) {
  const ApprovelyPaymentOrder = sequelize.define('ApprovelyPaymentOrder', {
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
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      // defaultValue: 'pending', // could be 'initiated', 'completed', 'failed', etc.
    },
    paymentType: {
      type: DataTypes.STRING, // e.g., card, ACH, google_pay
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'approvely_payment_orders',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: false
  })

  ApprovelyPaymentOrder.associate = function (models) {
    ApprovelyPaymentOrder.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    })
  }

  return ApprovelyPaymentOrder
}
