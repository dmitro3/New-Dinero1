import ajv from '@src/libs/ajv'
import { getLimitTable } from '../helper/casino'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id']
}



export class GetLimitTableHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id } = this.args

  
      const limitTable = await getLimitTable(id)

      return { limitTable, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
