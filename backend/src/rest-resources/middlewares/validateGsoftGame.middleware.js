import db from '@src/db/models'


export async function validateGsoftGame(req, res, next) {
  try {
    const casinoGameId = req.query?.gameid
    if (casinoGameId) {
      const casinoGame = await db.CasinoGame.findOne({
        where: { casinoGameId, isActive: true },
        attributes: ['id']
      })
      console.log(casinoGame)
      if (!casinoGame) return res.status(500).json({
        code: 500,
        status: "unsuccessSuccess",  // You can change this status message as needed
        message: "Game not found or inactive"
      });
      req.query.casinoGameId = casinoGame.id
    }
    // req.body.userId = decodedToken.userId
    // req.body.username = decodedToken?.username

    next()
  } catch (error) {
    next(InvalidTokenErrorType)
  }
}
