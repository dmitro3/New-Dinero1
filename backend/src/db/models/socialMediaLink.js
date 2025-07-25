"use strict";
module.exports = (sequelize, DataTypes) => {
  const SocialMediaLink = sequelize.define(
    "SocialMediaLink",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "social_media_links",
      schema: "public",
      timestamps: true,
      underscored: true,
    }
  );

  SocialMediaLink.associate = function (models) {

  };

  return SocialMediaLink;
};
