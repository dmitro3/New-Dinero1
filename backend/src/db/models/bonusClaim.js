'use strict';

module.exports = (sequelize, DataTypes) => {
    const BonusClaim = sequelize.define('BonusClaim', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        bonusId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        claimCoin: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 'bonus_claims',
        schema: 'public',
        timestamps: true,
        underscored: true
    });

    BonusClaim.associate = function (models) {
        // A claim belongs to a single bonus
        BonusClaim.belongsTo(models.DropBonus, { foreignKey: 'bonusId' });

        // A claim belongs to a single user
        BonusClaim.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return BonusClaim;
};