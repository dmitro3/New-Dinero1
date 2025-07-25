import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { getOne } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

export class GetLanguageHandler extends BaseHandler {
   async run () {
  
      const languages = await getOne({
        model: db.GlobalSetting,
        data: { key: 'SITE_INFORMATION' },
        attributes: ['value']
      })

      if (!languages) throw new AppError(Errors.TENANT_LANGUAGES_NOT_FOUND)

      return { languages: languages.value.languages, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
