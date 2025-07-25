'use strict';

module.exports = function (sequelize, DataTypes) {
    const ChatRule = sequelize.define('ChatRule', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        rules: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'chat_rules',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false,
    });

    return ChatRule;
};
