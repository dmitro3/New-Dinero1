import { Errors } from "@src/errors/errorCodes"
import { AppError } from "@src/errors/app.error"
import db from '@src/db/models'
import { getOne } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'
import { BaseHandler } from '@src/libs/logicBase'

export class SiteDetailHandler extends BaseHandler {
   async run () {
  
      const tenantDetail = await getOne({
        model: db.GlobalSetting,
        data: { key: 'SITE_INFORMATION' }
      })

      if (!tenantDetail) throw new AppError(Errors.TENANT_NOT_FOUND)

      return { tenantDetail: tenantDetail.value, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
