'use strict';

module.exports = (sequelize, DataTypes) => {
    const DropBonus = sequelize.define('DropBonus', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        coin: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        coinType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        totalClaimsAllowed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        totalClaims: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiryTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        tableName: 'bonus_drops',
        schema: 'public',
        timestamps: true,
        underscored: true
    });

    DropBonus.associate = function (models) {
        // A bonus can be claimed by many users
        DropBonus.hasMany(models.BonusClaim, { foreignKey: 'bonusId' });
    };

    return DropBonus;
};