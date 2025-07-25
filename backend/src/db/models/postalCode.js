'use strict'

import { POSTAL_CODE_STATUS } from "@src/utils/constants/public.constants";

module.exports = (sequelize, DataTypes) => {
    const PostalCode = sequelize.define('PostalCode', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gcCoin: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        scCoin: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM(Object.values(POSTAL_CODE_STATUS)),
            allowNull: false,
            defaultValue: 'PENDING'
        },
    }, {
        sequelize,
        tableName: 'postal_codes',
        schema: 'public',
        timestamps: true,
        underscored: true
    })

    PostalCode.associate = function (model) {
        PostalCode.belongsTo(model.User, {
            foreignKey: 'userId',
            as: 'user',
            constraints: false
        })
    }

    return PostalCode
}
