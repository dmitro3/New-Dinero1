import { Op } from 'sequelize'
import db from '@src/db/models'
import { getAll } from '../helper/crud'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

export class GetGlobalSettingsHandler extends BaseHandler {
  async run () {

    const settings = await getAll({
      model: db.GlobalSetting,
      data: { key: { [Op.in]: ['SITE_INFORMATION', 'BANNER'] } },
      order: [['key', 'ASC']]
    })

    return { settings, message: SUCCESS_MSG.GET_SUCCESS }

  }
}
