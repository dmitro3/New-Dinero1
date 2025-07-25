// SOCKET RELATED
export const SOCKET_NAMESPACES = {
  WALLET: '/wallet',
  LIVE_MATCH: '/live-match',
  PRE_MATCH: '/pre-match',
  LEADER_BOARD: '/leader-board',
  RECENT_BIG_WIN: '/recent-big-win',
  USER_CHAT: '/user-chat'
}

export const SOCKET_ROOMS = {
  USER_WALLET: 'USER_WALLET',
  LEADER_BOARD: 'LEADER_BOARD',
  RECENT_BIG_WIN: 'RECENT_BIG_WIN',
  USER_CHAT: 'USER_CHAT'
}

export const SOCKET_EMITTERS = {
  USER_WALLET_BALANCE: 'USER_WALLET_BALANCE',
  LEADER_BOARD: 'LEADER_BOARD',
  RECENT_BIG_WIN: 'RECENT_BIG_WIN',
  LIVE_USERS_CHATS: 'LIVE_USER_CHATS',
  LIVE_CHAT_RAIN: 'LIVE_CHAT_RAIN',
  CLOSED_CHAT_RAIN: 'CLOSED_CHAT_RAIN'
}

export const SOCKET_LISTENERS = {
  SEND_MESSAGE: 'SEND_MESSAGE'
}

// SOCKET RELATED

export const MARK_SESSION_ACTION = {
  SessionStart: 'SessionStart',
  SessionEnd: 'SessionEnd'
}

// used for ajv schema validation
export const MARK_SESSION_ACTION_OPTIONS = [
  'SessionStart',
  'SessionEnd'
]

export const SALT_ROUNDS = 15

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  REFUND: 'refund',
  BET: 'bet',
  WIN: 'win',
  ROLLBACK: 'rollback'
}

export const BONUS_TYPES = {
  DEPOSIT: 'deposit',
  LOSING: 'losing'
}

export const BONUS_STATUS = {
  ACTIVE: 'active',
  CLAIMED: 'claimed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
}

export const WITHDRAW_REQUEST_STATUS = {
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  APPROVED: 'approved'
}

export const SUBSCRIPTION_CHANNEL = {
  SEPARATOR: '_',
  USER_WALLET_BALANCE: 'USER_WALLET_BALANCE',
  MY_BETS: 'MY_BETS',
  ALL_BETS: 'ALL_BETS',
  HIGH_ROLLER_BETS: 'HIGH_ROLLER_BETS',
  CRASH_GAME_TIMER: 'CRASH_GAME_TIMER',
  CRASH_GAME_GRAPH_TIMER: 'CRASH_GAME_GRAPH_TIMER',
  CRASH_GAME_ROUND_STARTED: 'CRASH_GAME_ROUND_STARTED',
  CRASH_GAME_ROUND_BETTING_ON_HOLD: 'CRASH_GAME_ROUND_BETTING_ON_HOLD',
  CRASH_GAME_ROUND_STOPPED: 'CRASH_GAME_ROUND_STOPPED',
  CRASH_GAME_PLACED_BETS: 'CRASH_GAME_PLACED_BETS',
  JACKPOT: 'JACKPOT'
}

export const DEPOSIT_BONUS_TRANSACTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending'
}

export const GAMES = {
  DICE: 'dice',
  CRASH: 'crash'
}

export const GAME_RESULT = {
  WIN: 'win',
  LOOSE: 'loose',
  CANCEL: 'cancel'
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const PAYMENT_METHODS = {
  GAME: 'game'
}

export const AUTO_RATE = 1.01

export const ALLOWED_FILE_TYPES = ['png', 'tiff', 'tif', 'jpg', 'jpeg']

export const DEFAULT_GAME_ID = {
  CRASH: 1
}

export const settlementStatus = {
  IN_GAME: 'in_game',
  WON: 'won',
  LOST: 'lost',
  REFUND: 'refund',
  PARTIAL_WON: 'partial_won'
}

export const paymentForCodes = {
  BET_PLACEMENT: 1,
  WON: 2,
  CASHOUT: 3,
  REFUND: 4,
  LOST_BY_RESETTLEMENT: 5
}

export const VENDORS = {
  MAILGUN: 'MAILGUN',
  SENDGRID: 'SENDGRID'
}

export const USER_TYPES = {
  BOT: 'BOT',
  USER: 'USER'
}

export const AFFILIATE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}
