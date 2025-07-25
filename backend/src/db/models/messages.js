'use strict';

const { MESSAGE_STATUS, MESSAGE_TYPE } = require("@src/utils/constants/chat.constants");

module.exports = function (sequelize, DataTypes) {
  const Message = sequelize.define('Message', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    actioneeId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    chatRainId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // messageBinary: {
    //   type: DataTypes.TEXT,
    //   allowNull: true
    // },
    status: {
      type: DataTypes.ENUM(Object.values(MESSAGE_STATUS)),
      allowNull: false,
      defaultValue: MESSAGE_STATUS.ACTIVE
    },
    isContainOffensiveWord: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    chatGroupId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    messageType: {
      type: DataTypes.ENUM(Object.values(MESSAGE_TYPE)),
      defaultValue: MESSAGE_TYPE.MESSAGE,
    },
    // sharedEvent: {
    //   type: DataTypes.JSONB,
    //   allowNull: true,
    //   defaultValue: {},
    // },
    // replyMessageId: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true
    // },
    tipId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'messages',
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: false
  });

  Message.associate = function (models) {
    Message.belongsTo(models.User, { foreignKey: 'actioneeId', as: 'user' });
    Message.belongsTo(models.ChatRain, { foreignKey: 'chatRainId' });
    Message.belongsTo(models.ChatGroup, { foreignKey: 'chatGroupId', as: 'group' });
    // Message.belongsTo(models.Message, { foreignKey: 'replyMessageId', as: 'replyMessage' });
    Message.belongsTo(models.Tip, { foreignKey: 'tipId', as: 'tip' });
  };

  return Message;
};
