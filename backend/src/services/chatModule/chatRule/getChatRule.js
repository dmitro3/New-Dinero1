import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";

export class GetChatRuleHandler extends BaseHandler{

    async run (){
        const chatRules = await db.ChatRule.findAll()
        return { chatRules: chatRules }
    }
}