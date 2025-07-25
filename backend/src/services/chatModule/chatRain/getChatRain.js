import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { SUCCESS_MSG } from "@src/utils/success";
import { isNil, omitBy } from "lodash";

export class GetChatRainHandler extends BaseHandler {
    async run() {
        const { groupId } = this.args
        const query = {
            chatGroupId: groupId,
            isClosed: false
        }
        const filterQuery = omitBy(query, isNil)
        const chatRainDetails = await db.ChatRain.findAndCountAll({
            where: filterQuery,
           attributes:['id','name','description','prizeMoney','currencyId','chatGroupId','isClosed']

        })
        if (!chatRainDetails) throw new AppError(Errors.CHAT_RAIN_NOT_FOUND)
        else return { data: chatRainDetails, message: SUCCESS_MSG.GET_SUCCESS }
    }
}
