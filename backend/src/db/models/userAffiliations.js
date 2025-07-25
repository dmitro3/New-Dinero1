'use strict'
module.exports = function (sequelize, DataTypes) {
  const UserAffiliations = sequelize.define('UserAffiliations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    affiliateUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'userId of affiliate User'
    },
    referredUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'userId of reffered User'
    },
    earnedCommission: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total earned commission by the affiliate',
    },
    wageredAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total amount wagered by the referred user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'user_affiliations',
    schema: 'public',
    timestamps: true,
    underscored: true

  })
  UserAffiliations.associate = function (model) {
    UserAffiliations.belongsTo(model.User, { foreignKey: 'affiliateUserId', as: 'referrer',  })
    UserAffiliations.belongsTo(model.User, { foreignKey: 'referredUserId', as: 'referredUser', })
  }
  return UserAffiliations
}
