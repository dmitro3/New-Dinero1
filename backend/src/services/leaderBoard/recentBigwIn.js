import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { serverDayjs } from '@src/libs/dayjs'

export class GetRecentBigWinsHandler extends BaseHandler {
  async run() {
    const {
      pageNo = 1,
      limit = 10 // Default limit is 10
    } = this.args

    const offset = ((pageNo - 1) * limit || 0)
    const whereClauses = []

    whereClauses.push("tl.transaction_type = 'casino'")
    if (this.args.endDate) {
      const formattedCreatedAt = serverDayjs(this.args.endDate).format('YYYY-MM-DD HH:mm:ss')
      whereClauses.push(`ct.created_at >= '${formattedCreatedAt}'`)
    }

    const whereCondition = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
WITH FilteredCasinoTransactions AS (
    SELECT
        ct.game_round_id,  -- Group by game_round_id
        MAX(ct.user_id) AS user_id,
        MAX(u.username) AS username,
        MAX(u.profile_image) AS profileImage,
        MAX(cg.thumbnail_url) AS thumbnail_url,
        MAX(cg.name) AS game_name, 
        MAX(cg.id) AS gameId, 
        SUM(CASE WHEN ct.action_type = 'casino_bet' AND tl.currency_code != 'GC' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS total_bet_amount,
        SUM(CASE WHEN ct.action_type = 'casino_win' AND tl.currency_code != 'GC' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS total_win_amount,
        -- Calculate the difference between win and bet (win_difference)
        SUM(CASE WHEN ct.action_type = 'casino_win' AND tl.currency_code != 'GC' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) - 
        SUM(CASE WHEN ct.action_type = 'casino_bet' AND tl.currency_code != 'GC' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS win_difference,
        MAX(ct.created_at) AS created_at 
    FROM
        casino_transactions ct
    LEFT JOIN
        transaction_ledgers tl ON tl.transaction_id = ct.id
    LEFT JOIN
        casino_games cg ON cg.id = ct.casino_game_id
    LEFT JOIN
        users u ON u.user_id = ct.user_id
    ${whereCondition}  
    GROUP BY
        ct.game_round_id
),
PaginatedCasinoTransactions AS (
    SELECT *
    FROM FilteredCasinoTransactions
    ORDER BY win_difference DESC
    LIMIT :limit OFFSET :offset
)
SELECT
    (SELECT COUNT(*) FROM FilteredCasinoTransactions) AS total_count,
    json_agg(PaginatedCasinoTransactions) AS rows 
FROM PaginatedCasinoTransactions;
`

    const results = await db.sequelize.query(query, {
      replacements: {
        limit,
        offset
      },
      type: db.sequelize.QueryTypes.SELECT
    })

    return {
      data: results?.[0]?.rows || [],
      totalCount: results?.[0]?.total_count,
      pageNo,
      limit
    }
  }
}
