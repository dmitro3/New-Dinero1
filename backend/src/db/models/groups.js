'use strict'

module.exports = function (sequelize, DataTypes) {
  const Group = sequelize.define('Group', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'groups',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Group.associate = function (model) {
    // Group.hasMany(model.UserGroup, { foreignKey: 'groupId', onDelete: 'cascade' })
  }

  return Group
}
