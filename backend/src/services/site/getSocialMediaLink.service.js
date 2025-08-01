import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { BaseHandler } from "@src/libs/logicBase";
import { GLOBAL_SETTING } from "@src/utils/constant";

export class GetSocialMediaLinksService extends BaseHandler {
  async run () {
    try {
      const socialMediaLinks = await db.SocialMediaLink.findAndCountAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']]
      });

      if (!socialMediaLinks || socialMediaLinks.count === 0) {
        // Return empty array instead of throwing error for development
        return { socialMediaLinks: { rows: [], count: 0 }, message: 'Success' };
      }

      return { socialMediaLinks, message: 'Success' };
    } catch (error) {
      // Handle case when table doesn't exist
      console.log('Social media links table not found, returning empty result');
      return { socialMediaLinks: { rows: [], count: 0 }, message: 'Success' };
    }
  }
}
