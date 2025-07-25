import express from 'express'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import TicketController from '@src/rest-resources/controllers/ticket.controller'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import { getTicketsSchema } from '@src/json-schemas/ticket/getTickets.schema'
import { createTicketSchema } from '@src/json-schemas/ticket/createTicket.schema'
import { getTicketMessagesSchema } from '@src/json-schemas/ticket/getTicketMessages.schema'
import { createTicketMessageSchema } from '@src/json-schemas/ticket/createTicketMessage.schema'

const args = { mergeParams: true }
const ticketRouter = express.Router(args)

ticketRouter.route('/')
  .get(contextMiddleware(false), requestValidationMiddleware(getTicketsSchema), isUserAuthenticated, TicketController.getTickets)
  .post(contextMiddleware(true), requestValidationMiddleware(createTicketSchema), isUserAuthenticated, TicketController.createTicket)

ticketRouter.route('/message')
  .get(contextMiddleware(false), requestValidationMiddleware(getTicketMessagesSchema), isUserAuthenticated, TicketController.getTicketMessages)
  .post(contextMiddleware(true), requestValidationMiddleware(createTicketMessageSchema), isUserAuthenticated, TicketController.createTicketMessage)


export { ticketRouter }
