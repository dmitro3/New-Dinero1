import { BONUS_TYPE } from '@src/utils/constants/bonus.constants'

export const getAllBonusSchema = {
  query: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      limit: { type: 'string', default: 10 },
      pageNo: { type: 'string', default: 1 },
      bonusType: { enum: Object.values(BONUS_TYPE) }
    }
  }
}
