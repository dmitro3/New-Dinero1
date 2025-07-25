'use strict'

module.exports = function (sequelize, DataTypes) {
  const Package = sequelize.define('Package', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gcCoin: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    scCoin: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVisibleInStore: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discountAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'packages',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return Package
}
