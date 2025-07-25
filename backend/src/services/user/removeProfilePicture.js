import ajv from '@src/libs/ajv'
import config from '@src/configs/app.config'
import { removeLogo } from '@src/utils/common'
import { BaseHandler } from '@src/libs/logicBase'
import { SUCCESS_MSG } from '@src/utils/success'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' }
  },
  required: ['user']
}



export class RemoveProfileImageHandler extends BaseHandler {
  get constraints () {
    return constraints
  }

   async run () {
    const { user } = this.args

  
      const profileImageName = user.profileImage.split(/[.-]+/)
      const profileImageType = profileImageName.pop()

      const key = `${config.get('env')}/user_profile_image/${user.userId}-${profileImageName.pop()}.${profileImageType}`

      await removeLogo(key)
      await user.set({ profileImage: null }).save()

      return { success: true, message: SUCCESS_MSG.REMOVE_SUCCESS }
   
  }
}
