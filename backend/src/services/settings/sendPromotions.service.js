import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
// import bot from '@src/libs/telegramBot'

export class SendPromotionsHandler extends BaseHandler {
  async run () {
    // const { image, content } = this.args

  
      // const users = await db.User.findAll({ attributes: ['telegramId'] })
      // for (const user of users) {
      //     await bot.telegram.sendPhoto(user.telegramId, image, { caption: content })
      // }

      const users = await db.User.findAll({ attributes: ['telegramId'] })
      const sendMessages = users.map((user) => {
        return {} // edited
        // return bot.telegram.sendPhoto(user.telegramId, image, { caption: content, parse_mode: 'HTML' })
      })

      await Promise.all(sendMessages)

      return { success: true }
   
  }
}
