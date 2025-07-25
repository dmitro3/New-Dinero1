import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'

export class GetTopWinnersHandler extends BaseHandler {
  async run () {
    const query = `
            WITH FilteredCasinoTransactions AS (
                SELECT
                    ct.user_id,
                    MAX(u.username) AS username,
                    MAX(u.profile_image) AS profileImage,
                    SUM(CASE WHEN ct.action_type = 'casino_bet' AND tl.currency_code != 'GC'  AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS total_bet_amount,
                    SUM(CASE WHEN ct.action_type = 'casino_win' AND tl.currency_code != 'GC'  AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS total_win_amount,
                    -- Calculate the difference between win and bet
                    SUM(CASE WHEN ct.action_type = 'casino_win' AND tl.currency_code != 'GC' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) - 
                    SUM(CASE WHEN ct.action_type = 'casino_bet' AND tl.currency_code != 'GC'  AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS win_difference
                FROM
                    casino_transactions ct
                LEFT JOIN
                    transaction_ledgers tl ON tl.transaction_id = ct.id
                LEFT JOIN
                    users u ON u.user_id = ct.user_id
                WHERE
                    ct.action_type IN ('casino_bet', 'casino_win')
                    AND ct.created_at >= NOW() - INTERVAL '1 week'
                GROUP BY
                    ct.user_id
                HAVING
                    SUM(CASE WHEN ct.action_type = 'casino_win' AND tl.currency_code != 'GC'  AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) > 0
            )
            SELECT
                user_id,
                username,
                profileImage,
                total_bet_amount,
                total_win_amount,
                win_difference
            FROM
                FilteredCasinoTransactions
            ORDER BY
                win_difference DESC
            LIMIT 3;
            `

    const results = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT
    })

    return {
      data: results,
      topWinnersCount: results.length
    }
  }
}
