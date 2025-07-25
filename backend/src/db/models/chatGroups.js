'use strict';

module.exports = function (sequelize, DataTypes) {
    const ChatGroup = sequelize.define('ChatGroup', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        groupLogo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        admins: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        },
        criteria: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {}
        },
        isGlobal: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'chat_groups',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false
    });

    ChatGroup.associate = function (models) {
        ChatGroup.hasMany(models.Message, { foreignKey: 'chatGroupId', onDelete: 'cascade', as: 'messages' });
        ChatGroup.hasMany(models.UserChatGroup, { foreignKey: 'chatGroupId', onDelete: 'cascade', as: 'userChatGroups' });
        // ChatGroup.hasMany(models.ChatRain, { foreignKey: 'chatGroupId', as: 'chatRains' });
    };

    return ChatGroup;
};
