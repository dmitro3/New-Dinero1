'use strict'
module.exports = function (sequelize, DataTypes) {
  const CasinoAggregator = sequelize.define('CasinoAggregator', {
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'casino_aggregators',
    schema: 'public',
    timestamps: true,
    underscored: true

  })
  CasinoAggregator.associate = function (model) {
    CasinoAggregator.hasMany(model.CasinoProvider, { foreignKey: 'gameAggregatorId' })
  }
  return CasinoAggregator
}
