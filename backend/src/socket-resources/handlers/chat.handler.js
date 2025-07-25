import { Errors } from "@src/errors/errorCodes";
import { sendSocketResponse } from "@src/helpers/response.helpers";
import { SendMessageHandler } from "@src/services/chatModule/liveChat/sendMessage";

export default class ChatHandler {
    static async sendMessage(reqData, resCallback) {
        try {
            reqData = typeof reqData === 'string' ? JSON.parse(reqData) : reqData;
            const data = await SendMessageHandler.execute({ ...reqData.payload, ...reqData.context.socket.operator}, reqData.context)
            console.log(data)
            sendSocketResponse({ reqData, resCallback }, { data, defaultError: Errors.INTERNAL_SERVER_ERROR })
        } catch (error) {
            console.log(error)
            resCallback({ data: {}, erros: [Errors.INTERNAL_SERVER_ERROR] })
        }
    }
}