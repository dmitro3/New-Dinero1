import db from "@src/db/models";
import { BaseHandler } from "@src/libs/logicBase";
import { DEFAULT_CHAT_THEME } from "@src/utils/constants/chat.constants";

export class GetChatThemeHandler extends BaseHandler {
    async run() {
        const globalSettings = await db.GlobalSetting.findOne({
            where: { key: 'defaultChatTheme' },
            attributes: ['value']
        })
        if (!globalSettings) return DEFAULT_CHAT_THEME
        return { theme: JSON.parse(globalSettings.value) }
    }

}