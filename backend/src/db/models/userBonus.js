'use strict'

const { BONUS_STATUS } = require('@src/utils/constants/bonus.constants')

module.exports = (sequelize, DataTypes) => {
  const UserBonus = sequelize.define('UserBonus', {
    id: {
      type: DataTypes.INTEGER,          
      autoIncrement: true,              
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bonusId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    gcAmount: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.0
    },
    scAmount: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.0
    },
    bonusStatus: {
      type: DataTypes.ENUM(Object.values(BONUS_STATUS)),
      defaultValue: 'active' // Status of the bonus for the user
    },
    purchaseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true // Deposit amount tied to the purchase bonus
    }
  }, {
    tableName: 'user_bonuses',
    timestamps: true
  })

  // Associations
  UserBonus.associate = (models) => {
    UserBonus.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
    UserBonus.belongsTo(models.Bonus, {
      foreignKey: 'bonusId',
      as: 'bonus'
    })
  }

  return UserBonus
}
