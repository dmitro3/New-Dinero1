'use strict';

module.exports = function (sequelize, DataTypes) {
    const OffensiveWord = sequelize.define('OffensiveWord', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        tableName: 'offensive_words',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false,
    });

    return OffensiveWord;
};
