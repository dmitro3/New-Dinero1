/**
 * @function
 * @param {import("sequelize").Sequelize} sequelize
 */
module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('Currency', {
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'currencies',
    })

    Currency.associate = (models) => {
        Currency.hasMany(models.Wallet, { foreignKey: 'currencyCode', onDelete: 'CASCADE' })
    }

    return Currency
}
