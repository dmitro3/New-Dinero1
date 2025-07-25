'use strict';

module.exports = function (sequelize, DataTypes) {
    const Tip = sequelize.define('Tip', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipientId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        currencyId: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'tips',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false,
    });

    Tip.associate = function (models) {
        Tip.belongsTo(models.User, { foreignKey: 'userId', as: 'sender' });
        Tip.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipient' });
        Tip.hasMany(models.Message, { foreignKey: 'tipId' });
    };

    return Tip;
};
