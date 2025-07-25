'use strict'

module.exports = (sequelize, DataTypes) => {
  const CasinoGame = sequelize.define('CasinoGame', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    casinoGameId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    casinoCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    casinoProviderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileThumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasFreespins: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    devices: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    returnToPlayer: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    wageringContribution: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    demo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
    {
      sequelize,
      tableName: 'casino_games',
      schema: 'public',
      indexes: [
        {
          unique: true,
          fields: ['casino_game_id', 'casino_provider_id']
        }
      ],
      timestamps: true,
      underscored: true
    })

  CasinoGame.associate = function (models) {
    CasinoGame.belongsTo(models.CasinoCategory, {
      foreignKey: 'casinoCategoryId'
    })
    CasinoGame.belongsTo(models.CasinoProvider, {
      foreignKey: 'casinoProviderId'
    })

    CasinoGame.belongsTo(models.CasinoTransaction, {
      foreignKey: 'casinoGameId',
      targetKey: 'casinoGameId'
    })
    CasinoGame.hasMany(models.CasinoFavoriteGame, {
      foreignKey: 'casinoGameId',
      onDelete: 'cascade',
      as: 'CasinoFavoriteGames',
      hooks: true
    })
  }

  return CasinoGame
}
