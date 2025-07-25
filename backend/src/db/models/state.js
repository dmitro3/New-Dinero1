'use strict'

module.exports = function (sequelize, DataTypes) {
    const State = sequelize.define(
        'State',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            stateCode: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
        },
        {
            sequelize,
            modelName: 'State',
            tableName: 'states',
            schema: 'public',
            timestamps: true,
            underscored: true,
        }
    )

    State.associate = function (models) {
        State.hasMany(models.User, { foreignKey: 'stateCode' });
    }

    return State
}