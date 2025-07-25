import { sendResponse } from '@src/helpers/response.helpers'
import { GetNotificationsHandler } from '@src/services/notification'

export default class NotificationController {
  static async getNotifications (req, res, next) {
    try {
      console.log('here in controller')
      const data = await GetNotificationsHandler.execute(req.query)
      sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
