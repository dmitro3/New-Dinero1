import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { GLOBAL_SETTING } from "@src/utils/constant";


export class GetPostalCodeHandler extends BaseHandler {

    async run() {

        const postalCode = await db.GlobalSetting.findOne({
            where: { key: GLOBAL_SETTING.POSTAL_CODE }
        })

        if (!postalCode) {
            return { message: 'No banner download links found.' }
        }

        return { postalCode: postalCode.value, createdAt: postalCode.createdAt }
    }
}
