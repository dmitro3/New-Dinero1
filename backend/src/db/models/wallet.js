/**
 * @function
 * @param {import("sequelize").Sequelize} sequelize
 */
module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currencyCode: {
            type: DataTypes.STRING(3),
            allowNull: false,
            references: {
                model: 'currencies',
                key: 'code'
            }
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        timestamps: true,
        underscored: true,
        tableName: 'wallets',
    })

    Wallet.associate = (models) => {
        Wallet.belongsTo(models.User, { foreignKey: 'userId' })
        Wallet.belongsTo(models.Currency, { foreignKey: 'currencyCode' })
        Wallet.hasMany(models.TransactionLedger, { foreignKey: 'walletId', onDelete: 'CASCADE' })
    }
    return Wallet
}
