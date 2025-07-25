import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetCmsInfoHandler extends BaseHandler {
  async run () {
  
      const cmsDetails = await db.CmsPage.findAll({
        where: { isActive: true },
        attributes: ['cmsPageId', 'title', 'slug']

      })

      return { cmsDetails, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
