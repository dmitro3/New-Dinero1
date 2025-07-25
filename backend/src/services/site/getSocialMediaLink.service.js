import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { GLOBAL_SETTING } from "@src/utils/constant";

export class GetSocialMediaLinksService extends BaseHandler {
  async run () {

    const socialMediaLinks = await db.SocialMediaLink.findAndCountAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    if (!socialMediaLinks || socialMediaLinks.count === 0) {
      throw new AppError(Errors.SOCIAL_MEDIA_LINK_DOES_NOT_EXISTS);
    }

    return { socialMediaLinks, message: 'Success' };
  }
}
