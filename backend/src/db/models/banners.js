'use strict'
import { BANNER_TYPE } from '@src/utils/constants/public.constants'

module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define('Banner', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobileImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    redirectUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bannerType: {
      type: DataTypes.ENUM(...Object.values(BANNER_TYPE)),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'banners',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  Banner.associate = function (models) {
    // associations can be defined here
  }
  return Banner
}
