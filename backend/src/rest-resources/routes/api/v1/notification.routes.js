import express from 'express'
import NotificationController from '@src/rest-resources/controllers/notification.controller'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { getNotificationSchema } from '@src/json-schemas/notification/getNotification'

const args = { mergeParams: true }
const notificationRouter = express.Router(args)

notificationRouter.route('/')
  .get(contextMiddleware(false), isUserAuthenticated, requestValidationMiddleware(getNotificationSchema), NotificationController.getNotifications)

export { notificationRouter }
