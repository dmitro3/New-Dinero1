import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class GetStatesHandler extends BaseHandler {
    async run() {

        const states = await db.State.findAll({
            where: { isActive: true },
            attributes: ['name', 'stateCode']
        })

        return { states }

    }
}
