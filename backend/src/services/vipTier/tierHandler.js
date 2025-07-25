import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { getRequestIP } from '@src/utils/common'

export class TierHandlerHandler extends BaseHandler {
  async run() {
    const { userId, level } = this.args
    const transaction = this.dbTransaction

    // Validate and fetch the user
    const user = await db.User.findOne({
      where: { userId },
      transaction
    })
    if (!user) throw new AppError(Errors.USER_NOT_EXISTS)

    // Fetch user details
    const userDetails = await db.UserDetails.findOne({
      where: { userId },
      transaction
    })

    // Fetch the VIP tier using the level
    const vipTier = await db.VipTier.findOne({
      where: { level },
      // attributes: ['vipTierId'],
      transaction
    })
    if (!vipTier) throw new AppError(Errors.VIP_TIER_NOT_EXISTS)

    const nextVipTier = await db.VipTier.findOne({
      where: { level: vipTier.level + 1 },
      attributes: ['vipTierId', 'level'],
      transaction
    });

    if (!userDetails) {
      // If user details do not exist, create a new entry
      const data = {
        userId,
        vipTierId: vipTier.vipTierId,
        nextVipTierId: nextVipTier.vipTierId,
        ipAddress: getRequestIP(this.context.req)
      }
      await db.UserDetails.create(data, { transaction })
    } else {
      // If user details exist, update the vipTierId
      await userDetails.update(
        { vipTierId: vipTier.vipTierId },
        { transaction }
      )
    }

    return { userDetails }
  }
}
