'use strict'

const { TICKET_STATUSES } = require("@src/utils/constants/public.constants")

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(TICKET_STATUSES)),
      allowNull: false,
      defaultValue: TICKET_STATUSES.OPEN
    },
    // prioriy: {
    //   type: DataTypes.TEXT,
    //   allowNull: true
    // }
  }, {
    sequelize,
    tableName: 'tickets',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: 'userId' })
    Ticket.hasMany(models.TicketMessage, {
        foreignKey: 'ticketId', as: 'ticketMessage', onDelete: 'cascade',
    })
  }

  return Ticket
}
