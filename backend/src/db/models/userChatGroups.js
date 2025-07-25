'use strict';

module.exports = function (sequelize, DataTypes) {
    const UserChatGroup = sequelize.define('UserChatGroup', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        chatGroupId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        bannedTill: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        sequelize,
        tableName: 'user_chat_groups',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false
    });

    UserChatGroup.associate = function (models) {
        UserChatGroup.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        UserChatGroup.belongsTo(models.ChatGroup, { foreignKey: 'chatGroupId', as: 'chatGroup' });
    };

    return UserChatGroup;
};
