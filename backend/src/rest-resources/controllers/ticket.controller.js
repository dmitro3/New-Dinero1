import { sendResponse } from '@src/helpers/response.helpers'
import { CreateTicketMessageHandler, CreateTicketHandler, GetTicketMessagesHandler, GetTicketHandler } from '@src/services/ticket'

export default class TicketController {
  static async getTickets (req, res, next) {
    try {
      const data = await GetTicketHandler.execute({...req.query,...req.body},req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
  static async createTicket (req, res, next) {
    try {
      const data = await CreateTicketHandler.execute(req.body,req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getTicketMessages (req, res, next) {
    try {
      const data = await GetTicketMessagesHandler.execute({...req.query,...req.body},req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async createTicketMessage (req, res, next) {
    try {
      const data = await CreateTicketMessageHandler.execute(req.body,req.context)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
