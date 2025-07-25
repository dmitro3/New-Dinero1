import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/logicBase'
import { filterByDateCreatedAt, filterByMessage, pageValidation } from '@src/utils/common'
import { DELETED_MESSAGE, GLOBAL_GROUP_ID, MESSAGE_STATUS } from '@src/utils/constants/chat.constants'
import { isNil, omitBy, reverse } from 'lodash'
import sequelize, { Op } from 'sequelize'

export class GetGroupChatHandler extends BaseHandler {
  async run () {
    const { limit, pageNo, search, startDate, endDate, status, chatGroupId, userId } = this.args
    // const user = await db.User.findByPk(userId, { attributes: ['chatSettings'] })//make clarify
    let query = {
      status: (status) || MESSAGE_STATUS.ACTIVE,
      // chatGroupId: chatGroupId || null,
      isPrivate: false
    }
    if (search) query = filterByMessage(query, search)
    const { page, size } = pageValidation(pageNo, limit)
    if (startDate || endDate) query = filterByDateCreatedAt(query, startDate, endDate, 'Message')

    const userAttributes = [
      [sequelize.literal(`CASE WHEN "Message"."is_contain_offensive_word" = true THEN '${DELETED_MESSAGE}' ELSE "Message"."message" END`), 'message'],
      ['actionee_id', 'userId'],
      // [Sequelize.literal('CASE WHEN "user"."chat_settings"->>\'displayGIF\' = \'true\' THEN "message"."message_binary" END'), 'gif'],
      ['id', 'messageId'],
      'isContainOffensiveWord',
      ['message_type', 'messageType'],
      'createdAt',
      ['tip_id', 'tipId']
    ]
    if (userId) {
      const blockedUsers = await db.ReportedUser.findAll({
        attributes: ['reportedUserId'],
        where: {
          groupId: chatGroupId,
          actioneeId: userId,
          isUnblocked: false
        }
      })

      if (blockedUsers.length) {
        const blockedPlayers = blockedUsers.map(player => +player.reportedUserId)
        query.actioneeId = {
          [Op.notIn]: blockedPlayers
        }
      }
      // const userSetting = user.chatSetting //make clarify
      // if (userSetting?.displayGIF === 'false') query = { ...query, messageType: { [Op.not]: MESSAGE_TYPE.GIF } }
    }
    if (chatGroupId && parseInt(chatGroupId) !== GLOBAL_GROUP_ID) {
      query = { ...query, roomLanguageId: null }// make clarify
    }
    const filterQuery = omitBy(query, isNil)
    const chatDetails = await db.Message.findAndCountAll({
      where: filterQuery,
      subQuery: false,
      attributes: userAttributes,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['userId', 'username', 'profileImage', 'isEmailVerified'],
          include: [{
            model: db.UserDetails,
            as: 'userDetails',
            attributes: ['id'],
            include: [{
              model: db.VipTier,
              as: 'VipTier',
              attributes: ['vipTierId', 'name', 'level']
            }]
          }]
          // [sequelize.literal('CASE WHEN "user"."chat_settings"->>\'displayLevel\' = \'true\' THEN "user"."ranking_level" END'), 'rankingLevel'],
          // make clarify
        },
        {
          model: db.Tip,
          as: 'tip',
          attributes: ['id', 'amount'],
          include: [
            {
              model: db.User,
              as: 'recipient',
              attributes: ['username']
            },
            {
              model: db.User,
              as: 'sender',
              attributes: ['username']
            }
          ]
        },
        // {
        //     model: db.ChatRain,
        //     attributes: { exclude: ['updatedAt'] }
        // },
        {
          model: db.ChatRain,
          attributes: {
            exclude: ['updatedAt'],
            include: [
              [
                sequelize.literal(`
                                    CASE
                                        WHEN EXISTS (
                                            SELECT 1
                                            FROM "chat_rain_users" 
                                            WHERE "chat_rain_users"."chat_rain_id" = "ChatRain"."id" 
                                            AND "chat_rain_users"."user_id" = ${userId}
                                        ) 
                                        THEN true
                                        ELSE false
                                    END
                                `),
                'isUserClaimed'
              ]
            ]
          }
        }

      ],
      order: [['createdAt', 'DESC']],
      limit: size,
      offset: ((page - 1) * size)
    })
    chatDetails.rows = reverse(chatDetails?.rows)
    if (!chatDetails) throw new AppError(Errors.CHAT_NOT_FOUND)
    else return { data: chatDetails.rows, page, totalPages: Math.ceil(chatDetails.count / size) }
  }
}
