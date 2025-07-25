'use strict'

module.exports = (sequelize, DataTypes) => {
  const CasinoProvider = sequelize.define('CasinoProvider', {
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
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileThumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gameAggregatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      sequelize,
      tableName: 'casino_providers',
      schema: 'public',
      indexes: [
        {
          unique: true,
          fields: ['unique_id', 'game_aggregator_id']
        }
      ],
      timestamps: true,
      underscored: true
    })

  CasinoProvider.associate = function (models) {
    CasinoProvider.belongsTo(models.CasinoAggregator,
      { foreignKey: 'gameAggregatorId' });
    // CasinoProvider.belongsTo(models.CasinoGame, {
    //   as: 'casinoGames',
    //   foreignKey: 'id',
    //   targetKey: 'casinoProviderId',
    //   onDelete: 'cascade'
    // })
    CasinoProvider.hasMany(models.CasinoGame, {
      foreignKey: 'casinoProviderId',
      as: 'casinoGames'
    })

  }

  return CasinoProvider
}
