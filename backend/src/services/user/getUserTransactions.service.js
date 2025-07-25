import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import { dayjs } from '@src/libs/dayjs'
import { TRANSACTION_PURPOSE } from '@src/utils/constants/public.constants'

export class GetUserTransactionsHandler extends BaseHandler {
  async run() {
    const {
      pageNo = 1,
      limit = 10,
      startDate = dayjs().startOf('day').format(),
      endDate = dayjs().add(1, 'day').endOf('day').format(),
      currencyCode,
      purpose,
      userId
    } = this.args

    const offset = (pageNo - 1) * limit

    const purposes = purpose ? purpose.split(',') : []
    // const purposes = purpose ? [TRANSACTION_PURPOSE.BONUS_DROP, TRANSACTION_PURPOSE.FAUCET_AWAIL] : []
    // Dynamic WHERE Clause
    const whereClauses = []
    if (userId) whereClauses.push('t.user_id = :userId')
    if (currencyCode) whereClauses.push('tl.currency_code = :currencyCode')
    if (purposes.length > 0) whereClauses.push('t.purpose IN (:purposes)')
    if (startDate && endDate) {
      whereClauses.push('t.created_at BETWEEN :startDate AND :endDate')
    } else if (startDate) {
      whereClauses.push('t.created_at >= :startDate')
    } else if (endDate) {
      whereClauses.push('t.created_at <= :endDate')
    }

    const whereCondition = whereClauses.length
      ? `WHERE ${whereClauses.join(' AND ')}`
      : ''

    const query = `
      WITH FilteredTransactions AS (
      SELECT
          t.transaction_id,
          t.user_id,
          u.email,
          u.username,
          t.purpose,
          t.created_at,
          t.status,
          SUM(CASE WHEN tl.currency_code = 'GC' THEN tl.amount ELSE 0 END) AS gcCoin,
          SUM(CASE WHEN tl.currency_code IN ('RSC', 'BSC', 'PSC') THEN tl.amount ELSE 0 END) AS scCoins
      FROM
          transactions t
      LEFT JOIN
          transaction_ledgers tl
          ON tl.transaction_id = t.transaction_id and tl.transaction_type = 'banking'
      LEFT JOIN
          users u
          ON u.user_id = t.user_id
      ${whereCondition}
      GROUP BY
          t.transaction_id, u.email, u.username
      ),
      PaginatedTransactions AS (
          SELECT *
          FROM FilteredTransactions
          ORDER BY created_at DESC
          LIMIT :limit OFFSET :offset
      )
      SELECT
          (SELECT COUNT(*) FROM FilteredTransactions) AS total_count,
          json_agg(PaginatedTransactions) AS rows
      FROM PaginatedTransactions;`

    const results = await db.sequelize.query(query, {
      replacements: {
        userId,
        currencyCode,
        purposes,
        startDate,
        endDate,
        limit,
        offset
      },
      type: db.sequelize.QueryTypes.SELECT
    })

    console.log(results, "=======================================================>>")

    return {
      data: results?.[0]?.rows,
      totalCount: results?.[0]?.total_count,
      pageNo,
      limit,
      message: 'Transactions fetched successfully.'
    }
  }
}
