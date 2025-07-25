import { blockReportedUserSchema } from '@src/json-schemas/chat/blockedUser/blockUser.schema'
import { getReportedUserSchema } from '@src/json-schemas/chat/blockedUser/getBlockedUser.schema'
import { unblockReportedUserSchema } from '@src/json-schemas/chat/blockedUser/unblockUser.schema'
import { getChatGroupSchema } from '@src/json-schemas/chat/chatGroup/getChatGroup.schema'
import { getGroupChatSchema } from '@src/json-schemas/chat/chatGroup/getGroupChat.schema'
import { joinChatGroupSchema } from '@src/json-schemas/chat/chatGroup/joinChatGroup.schema'
import { claimChatRainSchema } from '@src/json-schemas/chat/chatRain/claimChatRain.schema'
import { emitChatRainSchema } from '@src/json-schemas/chat/chatRain/emitChatRain.schema'
import { getChatRainSchema } from '@src/json-schemas/chat/chatRain/getChatRain.schema'
import { getChatRuleSchema } from '@src/json-schemas/chat/chatRule/getChatRule.schema'
import { shareEventSchema } from '@src/json-schemas/chat/event/shareEvent.schema'
import { getThemeSchema } from '@src/json-schemas/chat/theme/getTheme.schema'
import { sendTipSchema } from '@src/json-schemas/chat/tip/tip.schema'
import { getUserInfoSchema } from '@src/json-schemas/chat/userInfo/getUserInfo.schema'
import LiveChatController from '@src/rest-resources/controllers/liveChat.controller'
import contextMiddleware from '@src/rest-resources/middlewares/context.middleware'
import { isUserAuthenticated } from '@src/rest-resources/middlewares/isUserAuthenticated'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
const args = { mergeParams: true }
const liveChatRouter = express.Router(args)


// liveChatRouter.route('/send-message')
//     .post(contextMiddleware(true), isUserAuthenticated,
//         requestValidationMiddleware(), LiveChatController.sendMessage)

liveChatRouter.route('/send-tip')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(sendTipSchema), LiveChatController.sendTip)

liveChatRouter.route('/join-chat-group')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(joinChatGroupSchema), LiveChatController.joinChatGroup)

liveChatRouter.route('/get-chat-group')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getChatGroupSchema), LiveChatController.getChatGroup)

liveChatRouter.route('/get-chat')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getGroupChatSchema), LiveChatController.getGroupChat)

liveChatRouter.route('/share-event')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(shareEventSchema), LiveChatController.shareEvent)

liveChatRouter.route('/theme')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getThemeSchema), LiveChatController.getTheme)

liveChatRouter.route('/claim-chat-rain')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(claimChatRainSchema), LiveChatController.claimChatRain)

liveChatRouter.route('/emit-chat-rain')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(emitChatRainSchema), LiveChatController.createChatRain)

liveChatRouter.route('/get-chat-rain')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getChatRainSchema), LiveChatController.getChatRain)

liveChatRouter.route('/get-reported-users')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getReportedUserSchema), LiveChatController.getBlockedUser)

liveChatRouter.route('/block-reported-user')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(blockReportedUserSchema), LiveChatController.blockUser)

liveChatRouter.route('/unblock-reported-user')
    .post(contextMiddleware(true), isUserAuthenticated,
        requestValidationMiddleware(unblockReportedUserSchema), LiveChatController.unblockUser)

liveChatRouter.route('/get-chat-rule')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getChatRuleSchema), LiveChatController.getChatRule)

liveChatRouter.route('/user-info')
    .get(contextMiddleware(false), isUserAuthenticated,
        requestValidationMiddleware(getUserInfoSchema), LiveChatController.getUserInfo)

export { liveChatRouter }
