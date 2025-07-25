export const ACTION_TYPE = {
  BET: 'bet',
  WIN: 'win',
  ROLLBACK: 'rollback'
}

export const GSOFT_CALLBACK_METHODS = {
  GET_ACCOUNT: 'getaccount',
  GET_BALANCE: 'getbalance',
  WAGER: 'wager',
  RESULT: 'result',
  ROLLBACK: 'rollback',
  WAGERANDRESULT: 'wagerAndResult'
}

export const GSOFT_STATUS = {
  200: {
    status: 'Success',
    message: 'Success'
  },
  1: {
    code: 1,
    status: 'Technical error',
    message: 'Technical error'
  },
  110: {
    code: 110,
    status: 'Operation not allowed',
    message: 'Operation not allowed'
  },
  1003: {
    code: 1003,
    status: 'Authentication failed',
    message: 'Authentication failed'
  },
  400: {
    code: 400,
    status: 'Transaction parameter mismatch',
    message: 'Transaction parameter mismatch'
  },
  409: {
    code: 409,
    status: 'Round closed or transaction ID exists',
    message: 'Round closed or transaction ID exists'
  },
  // 409: {
  //     code: 409,
  //     status: "transactionId already in use",
  //     message: "transactionId already in use",
  // },
  1000: {
    code: 1000,
    status: 'Not logged on',
    message: 'Not logged on'
  },
  1006: {
    code: 1006,
    status: 'Out of money',
    message: 'Out of money'
  },
  1019: {
    code: 1019,
    status: 'Gaming limit',
    message: 'Overall wager limit exceeded'
  },
  1008: {
    code: 1008,
    status: 'Parameter required',
    message: 'Parameter required'
  },
  102: {
    code: 102,
    status: 'Wager not found',
    message: 'Wager not found'
  },
  1007: {
    code: 1007,
    status: 'Unknown currency',
    message: 'Active bonus promotion only applicable on Sports bets. Please make a deposit to proceed with Casino Bets'
  }
}
