import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { BaseHandler } from '@src/libs/logicBase'
import { getOne } from '../helper/crud'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id']
}



export class GetWalletAmountHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { id } = this.args

  
      const amount = await getOne({ model: db.Wallet, data: { ownerId: id }, as: 'userWallet', attributes: ['amount'] })
      return { amount, message: SUCCESS_MSG.GET_SUCCESS }
   
  }
}
