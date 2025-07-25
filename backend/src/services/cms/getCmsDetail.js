import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { DEFAULT_LANGUAGE } from '@src/utils/constant'
import { SUCCESS_MSG } from '@src/utils/success'
import { getDynamicDataValue, insertDynamicDataInCmsTemplate } from '../helper/email'

export class GetCmsPageHandler extends BaseHandler {
  async run() {
    let { cmsPageId, cmsSlug, language } = this.args


    let query
    if (cmsPageId) query = { cmsPageId }
    if (cmsSlug) query = { slug: cmsSlug }
    if (!language) language = DEFAULT_LANGUAGE

    const cmsDetails = await db.CmsPage.findOne({
      where: query
    })

    if (!cmsDetails) throw new AppError(Errors.CMS_NOT_FOUND)
    if (!cmsDetails.content[language]) language = DEFAULT_LANGUAGE
    cmsDetails.content = await insertDynamicDataInCmsTemplate({ template: cmsDetails.content[language], dynamicData: await getDynamicDataValue() })

    return { cmsDetails, message: SUCCESS_MSG.GET_SUCCESS }

  }
}
