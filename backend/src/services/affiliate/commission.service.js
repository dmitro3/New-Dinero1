import db from '@src/db/models';
// import ajv from '@src/libs/ajv';
import { BaseHandler } from '@src/libs/logicBase';

// const constraints = ajv.compile({
//   type: 'object',
//   properties: {
//     referredUserId: { type: 'integer' },
//     affiliateUserId: { type: 'integer' }
//   },
//   required: ['referredUserId', 'affiliateUserId'],
// });

export class CreateAffiliateuserHandler extends BaseHandler {
  // get constraints() {
  //   return constraints;
  // }
  async run() {
    const { referredUserId, affiliateUserId } = this.args;
    const transaction = this.dbTransaction
    try {
      await db.UserAffiliations.create({
        affiliateUserId,
        referredUserId,
      }, { transaction })
      return
    } catch (error) {
      throw error;
    }
  }

}
