import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { GLOBAL_SETTING } from '@src/utils/constants/constants'


export class GetBannerDownloadHandler extends BaseHandler {

  async run() {

    const bannerDownloadSetting = await db.GlobalSetting.findOne({
      where: { key: GLOBAL_SETTING.BANNER_DOWNLOAD }
    })
    if (!bannerDownloadSetting) {
      return { message: 'No banner download links found.' }
    }

    return { bannerLinks: bannerDownloadSetting.value }
  }
}
