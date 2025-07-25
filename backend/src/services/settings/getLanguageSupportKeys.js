import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { getOne } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    language: { type: 'string' },
    userId: { type: ['number', 'null'] }
  },
  required: ['language']
}



export class GetLanguageSupportHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { language = 'EN', userId } = this.args

  
      let languageData = await getOne({ model: db.MultiLanguageSupport, data: { language } })
      if (!languageData) languageData = await getOne({ model: db.MultiLanguageSupport, data: { language: 'EN' } })
      if (userId) {
        const data = await getOne({
          model: db.User,
          data: { userId },
          attributes: ['locale'],
          include: [
            {
              model: db.UserDetails,
              as: 'userDetails',
              attributes: ['bannerText']
            }
          ]
        })
        if (data && data.userDetails.bannerText) languageData.dataValues.homeBannerDesc = data.userDetails.bannerText[language] || data.userDetails.bannerText[data.locale] || data.userDetails.bannerText.EN
      }

      const logoUrl = (await getOne({ model: db.GlobalSetting, where: { key: 'SITE_INFORMATION' }, attributes: ['value'] })).value.logo

      return { languageData, logoUrl, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
