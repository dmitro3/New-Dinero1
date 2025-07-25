'use strict'
const { DOCUMENT_STATUS_TYPES, DOCUMENT_TYPES } = require("@src/utils/constant")

module.exports = function (sequelize, DataTypes) {
  const UserDocument = sequelize.define('UserDocument', {
    userDocumentId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    documentUrl: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'document URl'
    },
    // level: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 1
    // },
    documentType: {
      type: DataTypes.ENUM(Object.values(DOCUMENT_TYPES)),
      allowNull: false
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(DOCUMENT_STATUS_TYPES)),
      allowNull: false,
      defaultValue: DOCUMENT_STATUS_TYPES.PENDING
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    veriffApplicantId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // actionee: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    // actionPerformedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true
    // },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'reason for rejection if rejected'
    }
  }, {
    sequelize,
    tableName: 'user_documents',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserDocument.associate = function (model) {
    UserDocument.belongsTo(model.User, { foreignKey: 'userId' })
  }

  return UserDocument
}