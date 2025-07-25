'use strict'

module.exports = (sequelize, DataTypes) => {
  const TicketMessage = sequelize.define('TicketMessage', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isAdminResponse: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'ticket_messages',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  TicketMessage.associate = (models) => {
    TicketMessage.belongsTo(models.Ticket, { foreignKey: 'ticketId' })
  }

  return TicketMessage
}
