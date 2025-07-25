'use strict'
module.exports = (sequelize, DataTypes) => {
  const CasinoFavoriteGame = sequelize.define('CasinoFavoriteGame', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    casinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'favorite_games',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  CasinoFavoriteGame.associate = function (models) {
    CasinoFavoriteGame.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    CasinoFavoriteGame.belongsTo(models.CasinoGame, {
      as: 'CasinoFavoriteGames',
      foreignKey: 'casinoGameId'
    })
  }
  return CasinoFavoriteGame
}
