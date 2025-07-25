'use strict'
module.exports = (sequelize, DataTypes) => {
  const BonusUserGroup = sequelize.define('BonusUserGroup', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bonusId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'bonus_user_groups',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  BonusUserGroup.associate = function (models) {
    BonusUserGroup.belongsTo(models.Bonus, { foreignKey: 'bonusId' })
    BonusUserGroup.belongsTo(models.Group, { foreignKey: 'groupId' })
  }
  return BonusUserGroup
}
