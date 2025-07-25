import db from '@src/db/models'
import { dayjs } from '@src/libs/dayjs'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

export class UpdateSelfExclusionHandler extends BaseHandler {
  async run() {
    const { userId, selfExclusion, isSelfExclusionPermanent, selfExclusionType } = this.args
    const transaction = this.context.sequelizeTransaction
    const selfExclusionUpdatedAt = dayjs()
    const formattedSelfExclusion = dayjs().format(selfExclusion)

    const userLimits = await db.Limit.upsert(
      {
        userId,
        selfExclusionEndAt: formattedSelfExclusion,
        isSelfExclusionPermanent: isSelfExclusionPermanent,
        selfExclusionStartedAt: selfExclusionUpdatedAt,
      }, { transaction })
    return { userLimits, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
