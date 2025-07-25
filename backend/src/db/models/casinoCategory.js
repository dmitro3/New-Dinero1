'use strict'

module.exports = (sequelize, DataTypes) => {
  const CasinoCategory = sequelize.define('CasinoCategory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'casino_categories',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  CasinoCategory.associate = function (model) {
    CasinoCategory.hasMany(model.CasinoGame, { as: 'CasinoGames', foreignKey: 'casinoCategoryId', onDelete: 'cascade' })
  }

  return CasinoCategory
}
