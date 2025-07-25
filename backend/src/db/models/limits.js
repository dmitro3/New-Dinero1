'use strict'

module.exports = function (sequelize, DataTypes) {
  const Limit = sequelize.define('Limit', {
    limitId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    selfExclusionEndAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isSelfExclusionPermanent: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    selfExclusionStartedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'limits',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Limit.associate = function (model) {
    Limit.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: false
    })
  }

  return Limit
}
