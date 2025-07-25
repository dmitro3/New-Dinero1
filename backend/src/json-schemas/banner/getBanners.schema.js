import { BANNER_TYPE } from '@src/utils/constants/public.constants'

export const getBannersSchema = {
  qeury: {
    properties: {
      limit: { type: 'string', default: 10 },
      pageNo: { type: 'string', default: 1 },
      key: { type: 'string', default: BANNER_TYPE.HOME }
    }
  }
}
