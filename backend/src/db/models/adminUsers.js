'use strict'

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    adminUserId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    adminRoleId: {
      type: DataTypes.INTEGER
    },
    parentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordSentAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    adminUsername: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    permission: {
      type: DataTypes.JSONB,
      allowNull: false
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'admin_users',
    schema: 'public',
    timestamps: true
  })

  AdminUser.associate = models => {
    AdminUser.belongsTo(models.AdminRole, {
      foreignKey: 'adminRoleId'
    })
  }

  return AdminUser
}
