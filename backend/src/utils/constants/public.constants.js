import { POSTAL_CODE } from "./constants"

export const BANNER_TYPE = {
  HOME: 'home',
  CASINO: 'casino',
  OTHER: 'other'
}

export const CASINO_AGGREGATORS = {
  GSOFT: 'GSOFT',
  ICONIC21: 'ICONIC21',
  ALEA: 'ALEA',
  '1GAMEHUB': '1GAMEHUB'
}

export const ONE_GAME_HUB_REQUEST_ACTIONS = {
  // Game Listing & Configuration
  AVAILABLE_GAMES: "available_games",
  AVAILABLE_CURRENCIES: "available_currencies",

  // Game Session Launch
  REAL_PLAY: "real_play",
  DEMO_PLAY: "demo_play",

  // FreeRounds Management
  FREEROUNDS_CREATE: "freerounds_create",
  FREEROUNDS_CANCEL: "freerounds_cancel",

  // Player Transactions
  BALANCE: "balance",
  BET: "bet",
  WIN: "win",
  CANCEL: "cancel"
};


export const COINS = {
  GOLD_COIN: 'GC',
  SWEEP_COIN: {
    BONUS_SWEEP_COIN: 'BSC',
    PURCHASE_SWEEP_COIN: 'PSC',
    REDEEMABLE_SWEEP_COIN: 'RSC'
  }
}

export const TRANSACTION_PURPOSE = {
  // General transactions
  PURCHASE: 'purchase',
  REDEEM: 'redeem',
  REDEEM_REFUND: 'redeem_refund',

  // Bonus transactions
  BONUS_CASH: 'bonus_cash',
  BONUS_DEPOSIT: 'bonus_deposit',
  BONUS_REFERRAL: 'bonus_referral',
  BONUS_TO_CASH: 'bonus_to_cash',
  BONUS_FORFEIT: 'bonus_forfeit',
  BONUS_WIN: 'bonus_win',
  BONUS_DROP: 'bonus_drop',
  BONUS_TIER:'bonus_tier',
  WELCOME_BONUS: 'welcome_bonus',
  POSTAL_CODE: 'postal_code',
  // Faucet transactions
  FAUCET_AWAIL: 'faucet_awail',

  // Spin Wheel transaction
  WHEEL_REWARD: "wheel_reward",

  // Chatrain transaction
  EMIT: 'emit_chatrain',
  CHATRAIN: 'chatrain',
  CLAIM: 'claim_chatrain',

  //Tip transaction
  SEND_TIP: 'send_tip',
  TIP: 'tip',
  RECEIVE_TIP: 'receive_tip'
}

// Casino transactions
export const CASINO_TRANSACTION_PURPOSE = {
  CASINO_BET: 'casino_bet',
  CASINO_REFUND: 'casino_refund',
  CASINO_WIN: 'casino_win',
  BONUS_DEPOSIT: 'bonus_deposit',
  JACKPOT_WIN: 'jackpot_win',
  PROMO_WIN: 'promo_win',
  BONUS_DROP: 'bonus_drop',
  BONUS_TIER:'bonus_tier',
  POSTAL_CODE: 'postal_code',
  GAME_ROLLBACK: 'game_rollback',
  CASINO_WIN_ROLLBACK: 'casino_win_rollback',
  CASINO_BET_ROLLBACK: 'casino_bet_rollback'
}

export const LEDGER_TYPES = {
  DEBIT: 'Debit',
  CREDIT: 'Credit'
}
export const WALLET_OWNER_TYPES = {
  USER: 'user',
  ADMIN: 'admin'
}
export const LEDGER_TRANSACTION_TYPES = {
  CASINO: 'casino',
  BANKING: 'banking',
  WITHDRAW: 'withdraw',
  BONUS: 'bonus',
  CHATRAIN: 'chatrain',
  TIP: 'tip'
}

export const POSTAL_CODE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}
export const VIP_TIER_NAMES = {
  BRONZE: 'Bronze',
  SILVER: 'silver',
  GOLD: 'gold'
}

export const LEDGER_DIRECTIONS = {
  [TRANSACTION_PURPOSE.PURCHASE]: LEDGER_TYPES.CREDIT,
  [TRANSACTION_PURPOSE.REDEEM]: LEDGER_TYPES.DEBIT,
  [TRANSACTION_PURPOSE.REDEEM_REFUND]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.CASINO_BET]: LEDGER_TYPES.DEBIT,
  [CASINO_TRANSACTION_PURPOSE.CASINO_WIN]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.CASINO_REFUND]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.BONUS_DROP]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.BONUS_TIER]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.BONUS_DEPOSIT]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.POSTAL_CODE]: LEDGER_TYPES.CREDIT,
  [TRANSACTION_PURPOSE.FAUCET_AWAIL]: LEDGER_TYPES.CREDIT,
  [TRANSACTION_PURPOSE.WHEEL_REWARD]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.CASINO_BET_ROLLBACK]: LEDGER_TYPES.CREDIT,
  [CASINO_TRANSACTION_PURPOSE.CASINO_WIN_ROLLBACK]: LEDGER_TYPES.DEBIT,
  [TRANSACTION_PURPOSE.EMIT]: LEDGER_TYPES.DEBIT,
  [TRANSACTION_PURPOSE.CLAIM]: LEDGER_TYPES.CREDIT,
  [TRANSACTION_PURPOSE.CHATRAIN]: LEDGER_TYPES.DEBIT,
  [TRANSACTION_PURPOSE.SEND_TIP]: LEDGER_TYPES.DEBIT,
  [TRANSACTION_PURPOSE.RECEIVE_TIP]: LEDGER_TYPES.CREDIT,
  [TRANSACTION_PURPOSE.WELCOME_BONUS]: LEDGER_TYPES.CREDIT,
}

export const WITHDRAWAL_STATUS = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  CANCELLED: 'Cancelled'
}

export const GRADUAL_LOSS_PERIOD_UNITS = {
  DAYS: 'days',
  MONTHS: 'months',
  YEARS: 'years'
}

export const TICKET_STATUSES = {
  OPEN: 'open',
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}
