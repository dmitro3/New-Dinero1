import db from '@src/db/models'
import { BaseHandler } from '@src/libs/logicBase'
import WalletEmitter from '@src/socket-resources/emmitter/wallet.emmitter';


export class SendRecentBigWinHandler extends BaseHandler {
  async run() {
    const {
      userId,
      roundId,
      amount,
      gameId
    } = this.args;

    // Query to fetch the transaction details based on userId and gameRoundId
    const transactionDetails = await db.sequelize.query(`
      WITH FilteredCasinoTransactions AS (
        SELECT
            ct.game_round_id,
            MAX(u.username) AS username,
            MAX(u.profile_image) AS profileImage,
            MAX(cg.thumbnail_url) AS thumbnail_url,
            MAX(cg.name) AS game_name, 
            SUM(CASE WHEN ct.action_type = 'casino_bet' AND tl.transaction_type = 'casino' THEN tl.amount ELSE 0 END) AS total_bet_amount
        FROM
            casino_transactions ct
        LEFT JOIN
            transaction_ledgers tl ON tl.transaction_id = ct.id
        LEFT JOIN
            casino_games cg ON cg.id = ct.casino_game_id
        LEFT JOIN
            users u ON u.user_id = ct.user_id
        WHERE
            ct.user_id = :userId AND ct.game_round_id = :gameRoundId
        GROUP BY
            ct.game_round_id
      )
      SELECT
        * 
      FROM FilteredCasinoTransactions
    `, {
      replacements: { userId, gameRoundId: roundId },
      type: db.Sequelize.QueryTypes.SELECT
    });

    // If the transaction details are found and there is a win difference
    if (transactionDetails.length === 1) {
      const {
        username,
        profileImage,
        thumbnail_url,
        game_name,
        total_bet_amount
      } = transactionDetails[0];

      // If the win amount exceeds the bet amount, trigger the event
      if ((amount - total_bet_amount) > 0) {
        WalletEmitter.emitRecentBigWinData({
          "game_round_id": roundId,
          "user_id": userId,
          "username": username,
          "profileimage": profileImage,
          "thumbnail_url": thumbnail_url,
          "game_name": game_name,
          "gameid": gameId,
          "total_bet_amount": Number(total_bet_amount),
          "total_win_amount": Number(amount),
          "win_difference": Number(amount) - Number(total_bet_amount),
        });
      }
    }
  }
}
