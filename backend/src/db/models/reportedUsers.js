'use strict';

module.exports = function (sequelize, DataTypes) {
    const ReportedUser = sequelize.define('ReportedUser', {
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        actioneeId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reportedUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        groupId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isUnblocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'reported_users',
        schema: 'public',
        timestamps: true,
        underscored: true,
        paranoid: false,
    });

      ReportedUser.associate = function (models) {
        ReportedUser.belongsTo(models.User, { foreignKey: 'reportedUserId', as: 'reportedUsers' });
        ReportedUser.belongsTo(models.User, { foreignKey: 'actioneeId', as: 'victimUser' });
      };

    return ReportedUser;
};
