import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'


export default class GetBalanceHandler extends BaseHandler {
    async run() {
        const { accountid, gamesessionid, nogsgameid } = this.args

        const user = await db.User.findOne({
            where: { userId: accountid },
            attributes: ['userId'],
            include: {
                model: db.Wallet,
                where: { isPrimary: true },
                attributes: ['amount'],
                required: true
            }
        })
        if (!user) return { code: 1003 }

        return {
            code: 200,
            status: "Success",
            balance: user.Wallets[0].amount,
            bonus_balance: 0,
            real_balance: user.Wallets[0].amount,
            game_mode: 1
        }
    }
}


