'use strict'

module.exports = (sequelize, DataTypes) => {
  const CmsPage = sequelize.define('CmsPage', {
    cmsPageId: {
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
    tableName: 'cms_pages',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return CmsPage
}
