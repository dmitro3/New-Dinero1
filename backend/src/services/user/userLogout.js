import { BaseHandler } from "@src/libs/logicBase"
import { client } from "@src/libs/redis"
import { SUCCESS_MSG } from "@src/utils/success"



export class UserLogoutHandler extends BaseHandler {
   async run() {
    const { userId } = this.args
    await client.del(`${userId}:ACCESS_TOKEN`)
    return { success: true, message: SUCCESS_MSG.LOGOUT_SUCESS }
  }
}
