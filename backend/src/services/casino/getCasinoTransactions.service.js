import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { dayjs } from '@src/libs/dayjs'

export class GetCasinoTransactionHandler extends BaseHandler {
  async run() {
    const {
      pageNo = 1,
      limit = 10,
      startDate = dayjs().startOf('day').format(),
      endDate = dayjs().add(1, 'day').endOf('day').format(),
      currencyCode,
      transactionType,
      userId
    } = this.args

    const offset = (pageNo - 1) * limit

    // Dynamic WHERE Clause
    const whereClauses = []
    if (userId) whereClauses.push('ct.user_id = :userId')
    if (currencyCode) whereClauses.push('tl.currency_code = :currencyCode')
    if (transactionType) whereClauses.push('ct.action_type = :transactionType')
    if (startDate && endDate) {
      whereClauses.push('ct.created_at BETWEEN :startDate AND :endDate')
    } else if (startDate) {
      whereClauses.push('ct.created_at >= :startDate')
    } else if (endDate) {
      whereClauses.push('ct.created_at <= :endDate')
    }

    const whereCondition = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
      WITH FilteredCasinoTransactions AS (
      SELECT
          ct.id AS casino_transaction_id,
          ct.casino_game_id,
          ct.user_id,
          u.email,
          cg.name AS casino_game_name,
          u.username,
          ct.action_type,
          ct.created_at,
          SUM(CASE WHEN tl.currency_code = 'GC' THEN tl.amount ELSE 0 END) AS gcCoin,
          SUM(CASE WHEN tl.currency_code IN ('RSC', 'BSC', 'PSC') THEN tl.amount ELSE 0 END) AS scCoins
      FROM
          casino_transactions ct
      LEFT JOIN
          transaction_ledgers tl
          ON tl.transaction_id = ct.id and tl.transaction_type = 'casino'
      LEFT JOIN
          casino_games cg
          ON cg.id = ct.casino_game_id
      LEFT JOIN
          users u
          ON u.user_id = ct.user_id
      ${whereCondition}
      GROUP BY
          ct.id, u.email, u.username, cg.name
      ),
      PaginatedCasinoTransactions AS (
          SELECT *
          FROM FilteredCasinoTransactions
          ORDER BY created_at DESC
          LIMIT :limit OFFSET :offset
      )
      SELECT
          (SELECT COUNT(*) FROM FilteredCasinoTransactions) AS total_count,
          json_agg(PaginatedCasinoTransactions) AS rows
      FROM PaginatedCasinoTransactions;`

    const results = await db.sequelize.query(query, {
      replacements: {
        userId,
        currencyCode,
        transactionType,
        startDate,
        endDate,
        limit,
        offset
      },
      type: db.sequelize.QueryTypes.SELECT
    })

    return {
      data: results?.[0]?.rows,
      totalCount: results?.[0]?.total_count,
      pageNo,
      limit,
      message: 'Transactions fetched successfully.'
    }
  }
}
