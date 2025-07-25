import { BONUS_TYPE, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants'

export const getUserBonusSchema = {
  query: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      status: { enum: Object.values(USER_BONUS_STATUS_VALUES) },
      bonusType: { enum: Object.values(BONUS_TYPE) }
    },
    required: ['userId']
  }
}
