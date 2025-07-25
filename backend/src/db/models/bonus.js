import { BONUS_STATUS, BONUS_TYPE } from '@src/utils/constants/bonus.constants'
'use strict'
module.exports = (sequelize, DataTypes) => {
  const Bonus = sequelize.define('Bonus', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    bonusType: {
      type: DataTypes.ENUM(Object.values(BONUS_TYPE)),
      allowNull: false
    },
    promotionTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gcAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0
    },
    scAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0
    },
    percentage: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true // applicable for purchase bonuses
    },
    maxBonusLimit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true // for deposit bonuses
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true // optional for bonus image
    },
    status: {
      type: DataTypes.ENUM(Object.values(BONUS_STATUS)),
      defaultValue: BONUS_STATUS.ACTIVE
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true // optional for further bonus details
    },
    termsConditions: {
      type: DataTypes.TEXT,
      allowNull: true // store specific terms for each bonus
    }
  }, {
    tableName: 'bonuses',
    timestamps: true
  })

  // Associations can be defined here
  Bonus.associate = (models) => {
    Bonus.hasMany(models.UserBonus, {
      foreignKey: 'bonusId',
      as: 'userBonus'
    })
  }

  return Bonus
}
