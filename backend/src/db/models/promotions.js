'use strict'

module.exports = (sequelize, DataTypes) => {
  const Promotions = sequelize.define('Promotions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'promotions',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return Promotions
}
