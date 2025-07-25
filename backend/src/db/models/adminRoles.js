'use strict'
module.exports = (sequelize, DataTypes) => {
  const AdminRole = sequelize.define('AdminRole', {
    roleId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM('Super Admin', 'Admin', 'Manager'),
      allowNull: false
    },
    permission: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    level: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'admin_roles',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  AdminRole.associate = function (models) {
    AdminRole.hasMany(models.AdminUser, {
      foreignKey: 'adminRoleId'
    })
  }
  return AdminRole
}
