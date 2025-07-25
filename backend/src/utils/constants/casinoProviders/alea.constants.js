export const ALEA_PLAY_CASINO_TYPES = {
  BET: 'BET',
  WIN: 'WIN',
  BET_WIN: 'BET_WIN',
  ROLLBACK: 'ROLLBACK',
  BALANCE: 'BALANCE'
}

export const ALEA_ERROR_TYPES = {
  INVALID_SIGNATURE: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'Signature Incorrect'
  },
  SESSION_EXPIRED: {
    statusCode: 403,
    status: 'DENIED',
    code: 'SESSION_EXPIRED',
    message: 'The casinoSessionId is no longer valid on the Operator’s platform'
  },
  WIN_SESSION_EXPIRED: {
    statusCode: 500,
    status: 'DENIED',
    code: 'INVALID_REQUEST',
    message: 'Game Session Expired'
  },
  ROLLBACK_SESSION_EXPIRED: {
    statusCode: 500,
    status: 'DENIED',
    code: 'INVALID_REQUEST',
    message: 'Game Session Expired'
  },
  BET_SESSION_EXPIRED: {
    statusCode: 403,
    status: 'DENIED',
    code: 'SESSION_EXPIRED',
    message: 'Game Session Expired'
  },
  PLAYER_BLOCKED: {
    statusCode: 403,
    code: 'PLAYER_BLOCKED',
    message: 'Player is Blocked due to casino internal reason.'
  },
  BET_DENIED: {
    status: 'DENIED',
    statusCode: 403,
    code: 'BET_DENIED',
    message: 'This bet is denied due to casino internal reason.'
  },
  PLAYER_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: "Player couldn't be found in casino's system."
  },
  INTERNAL_ERROR: {
    statusCode: 503,
    status: 'ERROR',
    code: 'INTERNAL_ERROR',
    message: 'Please contact casino for this with the initial request.'
  },
  GAME_NOT_FOUND: {
    statusCode: 503,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'This game could not be found in the casino.'
  },
  BET_GAME_NOT_FOUND: {
    statusCode: 403,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'This bet game could not be found in the casino.'
  },
  GAME_NOT_ALLOWED: {
    statusCode: 403,
    status: 'DENIED',
    code: 'GAME_NOT_ALLOWED',
    message: 'This game could not be found in the casino.'
  },
  ROLLBACK_GAME_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'This rollback game could not be found in the casino.'
  },
  BET_MAX: {
    status: 403,
    code: 'BET_MAX',
    message: "Player's betting limit has exceeded."
  },
  DUPLICATE_TRANSACTION_DATA_MISMATCH: {
    status: 400,
    code: 'DUPLICATE_TRANSACTION_DATA_MISMATCH',
    message: 'Transaction found with data mismatch.'
  },
  INSUFFICIENT_FUNDS: {
    statusCode: 403,
    status: 'DENIED',
    code: 'INSUFFICIENT_FUNDS',
    message: "Player doesn't have sufficient balance to place a bet."
  },
  UNKNOWN_ERROR: {
    statusCode: 500,
    status: 400,
    code: 'UNKNOWN_ERROR',
    message: "Transaction has been declined due to casino's internal checks."
  },
  TRANSACTION_ALREADY_PROCESSED: {
    statusCode: 400,
    code: 'TRANSACTION_ALREADY_PROCESSED',
    isAlreadyProcessed: true,
    message: 'Provided Transaction has already been processed before.'
  },
  TRANSACTION_NOT_FOUND: {
    statusCode: 404,
    status: 404,
    code: 'TRANSACTION_NOT_FOUND',
    message: 'Casino could not find transaction, hence cannot be processed ahead.'
  },
  INVALID_CURRENCY: {
    statusCode: 500,
    status: 'ERROR',
    code: 'INVALID_REQUEST',
    message: 'Request Made with invalid currency.'
  },
  PLAYER_NOT_FOUND: {
    statusCode: 500,
    status: 'ERROR',
    code: 'PLAYER_NOT_FOUND',
    message: 'Request Made with invalid casninoPlayerId'
  },
  INVALID_CASINO_PLAYER_ID: {
    statusCode: 500,
    status: "ERROR",
    code: "INVALID_REQUEST",
    message: "Request Made with invalid casninoPlayerId"
  },
  GAME_SESSION_EXPIRE: {
    statusCode: 400,
    status: 'DENIED',
    code: 'SESSION_EXPIRED',
    message: 'Game Session Expired'
  }
}


export const ALEA_SESSION_PREFIX = 'alea-'
export const ONE_GAME_HUB_SESSION_PREFIX = 'onegh-'