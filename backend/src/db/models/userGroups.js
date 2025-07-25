'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserGroup = sequelize.define('UserGroup', {
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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_groups',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserGroup.associate = function (model) {
    UserGroup.belongsTo(model.Group, { foreignKey: 'groupId' })
    UserGroup.belongsTo(model.User, { foreignKey: 'userId' })
  }

  return UserGroup
}
