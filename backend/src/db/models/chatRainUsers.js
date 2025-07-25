'use strict';

module.exports = function (sequelize, DataTypes) {
    const ChatRainUser = sequelize.define('ChatRainUser', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        chatRainId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        winAmount: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        }
    },
        {
            sequelize,
            tableName: 'chat_rain_users',
            schema: 'public',
            timestamps: true,
            underscored: true,
            paranoid: false
        }
    );

    // ChatRainUser.associate = function (models) {
    //     ChatRainUser.belongsTo(models.ChatRain, { foreignKey: 'chatRainId', as: 'chatRain' });
    //     ChatRainUser.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // };

    return ChatRainUser;
};
