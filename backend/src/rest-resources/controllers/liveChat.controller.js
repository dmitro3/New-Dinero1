import { sendResponse } from "@src/helpers/response.helpers"
import { ClaimChatRainHandler } from "@src/services/chatModule/chatRain/claimChatRain"
import { CreateChatRainHandler } from "@src/services/chatModule/chatRain/emitChatRain"
import { GetChatRainHandler } from "@src/services/chatModule/chatRain/getChatRain"
import { GetChatRuleHandler } from "@src/services/chatModule/chatRule/getChatRule"
import { GetChatGroupHandler } from "@src/services/chatModule/liveChat/getChatGroup"
import { GetGroupChatHandler } from "@src/services/chatModule/liveChat/getGroupChat"
import { JoinChatGroupHandler } from "@src/services/chatModule/liveChat/joinChatGroup"
import { SendMessageHandler } from "@src/services/chatModule/liveChat/sendMessage"
import { ShareEventHandler } from "@src/services/chatModule/liveChat/shareEvent"
import { BlockUserHandler } from "@src/services/chatModule/reportedUsers/blockUser"
import { GetBlockedUserHandler } from "@src/services/chatModule/reportedUsers/getBlockedUsers"
import { UnBlockUserHandler } from "@src/services/chatModule/reportedUsers/unBlockUser"
import { GetChatThemeHandler } from "@src/services/chatModule/theme/getTheme"
import { SendUserTipHandler } from "@src/services/chatModule/tip/sendUserTip"
import { GetUserInfoHandler } from "@src/services/chatModule/userInfo/getUserInfo"

export default class LiveChatController {

    // static async sendMessage(req, res, next) {
    //     try {
    //         const data = await SendMessageHandler.execute({ ...req.body }, req.context)
    //         sendResponse({ req, res, next }, data)
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    static async sendTip(req, res, next) {
        try {
            const data = await SendUserTipHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async joinChatGroup(req, res, next) {
        try {
            const data = await JoinChatGroupHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getChatGroup(req, res, next) {
        try {
            const data = await GetChatGroupHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)

        } catch (error) {
            next(error)
        }
    }
    static async getGroupChat(req, res, next) {
        try {
            const data = await GetGroupChatHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }

    static async shareEvent(req, res, next) {
        try {
            const data = await ShareEventHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }

    static async getTheme(req, res, next) {
        try {
            const data = await GetChatThemeHandler.execute({ ...req.body }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async claimChatRain(req, res, next) {
        try {
            const data = await ClaimChatRainHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async createChatRain(req, res, next) {
        try {
            const data = await CreateChatRainHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getChatRain(req, res, next) {
        try {
            const data = await GetChatRainHandler.execute({ ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getBlockedUser(req, res, next) {
        try {
            const data = await GetBlockedUserHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async blockUser(req, res, next) {
        try {
            const data = await BlockUserHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async unblockUser(req, res, next) {
        try {
            const data = await UnBlockUserHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getChatRule(req, res, next) {
        try {
            const data = await GetChatRuleHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
    static async getUserInfo(req, res, next) {
        try {
            const data = await GetUserInfoHandler.execute({ ...req.body, ...req.query }, req.context)
            sendResponse({ req, res, next }, data)
        } catch (error) {
            next(error)
        }
    }
}