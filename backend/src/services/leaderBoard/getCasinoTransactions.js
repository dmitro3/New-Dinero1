import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@src/utils/constants/constants'

export class GetLeaderBoardHandler extends BaseHandler {
  async run () {
    const { pageNo = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = this.args

    const offset = ((pageNo - 1) * limit)
    const whereClauses = []

    whereClauses.push("tl.transaction_type = 'casino'")
    whereClauses.push("ct.action_type IN ('casino_bet', 'casino_win')")

    const whereCondition = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
      WITH FilteredCasinoTransactions AS (
          SELECT
              -- Grouping only by game_round_id
              ct.game_round_id,

              -- Aggregating non-grouped fields using MAX()
              MAX(ct.casino_game_id) AS casino_game_id,
              MAX(cg.name) AS casino_game_name,
              MAX(cg.thumbnail_url) AS thumbnail_url,  
              MAX(u.username) AS username,
              MAX(ct.user_id) AS user_id,  
              MAX(ct.created_at) AS created_at, 
              MAX(tl.currency_code) AS currency_code,  

              -- Aggregating bet and win amounts
              SUM(CASE 
                    WHEN ct.action_type = 'casino_bet' THEN tl.amount 
                    ELSE 0 
                  END) AS bet_amount,
              SUM(CASE 
                    WHEN ct.action_type = 'casino_win' THEN tl.amount 
                    ELSE 0 
                  END) AS win_amount
              
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
              ct.game_round_id  -- Only grouping by game_round_id
      ),
      PaginatedCasinoTransactions AS (
          SELECT *
          FROM FilteredCasinoTransactions
          ORDER BY created_at DESC  -- Sorting by created_at in descending order
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
      totalCount: results?.[0]?.total_count || 0,
      pageNo,
      limit
    }
  }
}
