'use strict';

module.exports = function (sequelize, DataTypes) {
    const ChatRain = sequelize.define('ChatRain', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        prizeMoney: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        currencyId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        closedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        // criteria: {
        //     type: DataTypes.JSONB,
        //     allowNull: true,
        //     defaultValue: {}
        // },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        playerCount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // chatGroupId: {
        //     type: DataTypes.BIGINT,
        //     allowNull: false,
        // },
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
        {
            sequelize,
            tableName: 'chat_rains',
            schema: 'public',
            timestamps: true,
            underscored: true,
            paranoid: false
        }
    );

    // ChatRain.associate = function (models) {
    //     ChatRain.belongsTo(models.Currency, { foreignKey: 'currencyId', as: 'currency' });
    //     ChatRain.belongsTo(models.ChatGroup, { foreignKey: 'chatGroupId', as: 'chatGroup' });
    //     ChatRain.hasMany(models.ChatRainUser, { foreignKey: 'chatRainId', as: 'chatRainUsers' });
    // };

    return ChatRain;
};
