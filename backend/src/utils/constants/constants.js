export const RESPONSIBLE_GAMING_ENDPOINTS = [
  'set-daily-limit',
  'set-loss-limit',
  'set-deposit-limit',
  'set-disable-until',
  'set-session-time'
]

export const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support',
  USER: 'user'
}
export const USER_VIP_TIER_PROGRESS_KEYS = {
  wageringThreshold: 1,
  gamesPlayed: 1,
  bigBetsThreshold: 1,
  depositsThreshold: 1,
  loginStreak: 1,
  referralsCount: 1,
  sweepstakesEntries: 1,
  sweepstakesWins: 1,
  timeBasedConsistency: 1
}
export const TICKET_TYPE = {
  REDEMPTION: '1',
  EXPIRY: '2',
  FRAUD: '3',
  VERIFICATION: '4'
}

export const TICKET_STATUS = {
  UNASSIGNED: '0',
  PENDING: '1',
  SUCCESS: '2'
}

export const ROLE_ID = {
  ADMIN: 1,
  MANAGER: 2,
  SUPPORT: 3
}

export const DOCUMENTS = {
  ID: 'ID_PROOF',
  ADDRESS: 'ADDRESS_PROOF',
  BANK_CHECKING: 'BANK_CHECKING',
  BANK_SAVINGS: 'BANK_SAVINGS'
}

export const BANK_ACCOUNT_TYPE = {
  CHECKING: '0',
  SAVINGS: '1'
}

export const BREAK_TYPE = {
  TAKE_A_BREAK: 'TAKE_A_BREAK',
  SELF_EXCLUSION: 'SELF_EXCLUSION'
}

export const SELF_EXCLUSION_TYPE = {
  CURRENT: 'current',
  ALL: 'all'
}

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4
}

export const CUSTOMER_IO_TRANSACTION_ID = {
  VERIFY_MESSAGE_ID: 'verify_email',
  FORGET_PASSWORD_MESSAGE_ID: 'forgot_password',
  PASSWORD_CONFIRMED_MESSAGE_ID: 'password_reset_confirmation',
  SIGNUP_SUCCESS: 'signup_success'
}
export const GLOBAL_SETTING = {
  BANNER_DOWNLOAD: "banner_download"
}

export const TRANSACTION_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
  FAILED: 3,
  ROLLBACK: 4,
  APPROVED: 5,
  DECLINED: 6,
  INPROGRESS: 7,
  POSTPONE: 8,
  WAGERED: 9
}

export const STATUS_VALUE = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  ACTIVE: 'ACTIVE'
}

export const UPLOAD_FILE_SIZE = 5000000
export const OK = 'ok'

export const TYPE = {
  CRYPTO: 'CRYPTO',
  FIAT: 'FIAT',
  PRIZEOUT: 'PRIZEOUT',
  CRYPTO_ID: 0,
  FIAT_ID: 1
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'redeem',
  BONUS: 'bonus',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney'
}

export const GAME_CATEGORY = {
  TABLE_GAME: 'table',
  CASINO_GAME: 'casino'
}

export const GAME_THUMBNAILS = [
  'thumbnailUrl',
  'thumbnailLongUrl',
  'thumbnailShortUrl'
]

export const RESTRICTED_TYPE = {
  PROVIDERS: 'PROVIDERS',
  GAMES: 'GAMES'
}

export const EMAIL_SUBJECTS = {
  emailVerification: 'Verify Your Email',
  verification: 'Identity Verification Requested',
  userActivate: 'Account Activation',
  userDeactivate: 'Account Deactivated',
  kycRejected: 'Kyc Rejected - Action required',
  kycVerified: 'Congratulation Your Kyc Has Been Approved',
  kycApproved: 'Document Approved',
  kycRequested: 'Document Requested for KYC',
  passwordReset: 'Reset your password',
  redeemRequested: 'Redemption Request Received',
  registrationWelcome: 'Welcome To Stackr',
  passwordResetConfirmed: 'Password Reset Confirmed',
  phoneVerification: 'Phone Verified Successfully',
  purchaseSuccess: 'Package Purchased Successfully',
  purchaseLimitSet: 'Purchase limit is set',
  timeLimitSet: 'Time limit is set',
  selfExclusion: 'you are self exclude',
  takeBreak: 'Take a break'
}

export const CASINO_TRANSACTION_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3
}

export const AMOUNT_TYPE = {
  GC_COIN: 0,
  SC_COIN: 1,
  CASH_NON_CASH: 2
}

export const WAGERING_TYPE = {
  BONUS: 'bonus',
  BONUSDEPOSIT: 'bonusdeposit'
}

export const BONUS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FORFEIT: 'FORFEITED',
  EXPIRED: 'EXPIRED',
  CLAIMED: 'CLAIMED',
  IN_PROCESS: 'IN-PROCESS',
  LAPSED: 'LAPSED'
}

export const BONUS_RESET_HOUR = 0
export const BONUS_EXTEND_HOUR = 6
export const BONUS_EXTEND_BREAKPOINT_HOUR = 21

export const WAGER_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const KEYS = {
  MAX_BONUS_THRESHOLD: 'maxBonusThreshold',
  MIN_DEPOSIT: 'minDeposit',
  MAX_WIN_AMOUNT: 'maxWinAmount',
  ZERO_OUT_THRESHOLD: 'zeroOutThreshold',
  MIN_BALANCE: 'minBalance'
}

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30
}

export const STRICTLY_REQUIRED_REGISTRATION_FIELDS = [
  'email',
  'password',
  'firstName',
  'username',
  'lastName',
  'dateOfBirth',
  'address',
  'gender',
  'countryCode',
  'currencyCode'
]

export const REPORTING_CURRENCY = 'EUR'
export const MAX_QUANTITY = 100
export const ACCOUNT_TYPE = 'REAL'

export const META_PIXEL_EVENT_NAME = {
  REGISTER: { NAME: 'CompleteRegistration', ID: '32956271-98dc-4629-9d9f-c056d9f90a41' },
  PURCHASE: { NAME: 'Purchase', ID: 'e5e86aa9-cf6e-49b0-9386-8b44611e5cd2' }
}

export const META_PIXEL_ACTION_SOURCE = {
  EMAIL: 'email',
  WEBSITE: 'website',
  APP: 'app',
  CHAT: 'chat',
  PHONE_CALL: 'phone_call'
}

export const COUNTRY_CURRENCY_MAPPER = {
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BA: 'BAM',
  BB: 'BBD',
  WF: 'XPF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BT: 'BTN',
  JM: 'JMD',
  BV: 'NOK',
  BW: 'BWP',
  WS: 'WST',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  JE: 'GBP',
  BY: 'BYR',
  BZ: 'BZD',
  RU: 'RUB',
  RW: 'RWF',
  RS: 'RSD',
  TL: 'USD',
  RE: 'EUR',
  TM: 'TMT',
  TJ: 'TJS',
  RO: 'RON',
  TK: 'NZD',
  GW: 'XOF',
  GU: 'USD',
  GT: 'GTQ',
  GS: 'GBP',
  GR: 'EUR',
  GQ: 'XAF',
  GP: 'EUR',
  JP: 'JPY',
  GY: 'GYD',
  GG: 'GBP',
  GF: 'EUR',
  GE: 'GEL',
  GD: 'XCD',
  GB: 'GBP',
  GA: 'XAF',
  SV: 'USD',
  GN: 'GNF',
  GM: 'GMD',
  GL: 'DKK',
  GI: 'GIP',
  GH: 'GHS',
  OM: 'OMR',
  TN: 'TND',
  JO: 'JOD',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  HK: 'HKD',
  HN: 'HNL',
  HM: 'AUD',
  VE: 'VEF',
  PR: 'USD',
  PS: 'ILS',
  PW: 'USD',
  PT: 'EUR',
  SJ: 'NOK',
  PY: 'PYG',
  IQ: 'IQD',
  PA: 'PAB',
  PF: 'XPF',
  PG: 'PGK',
  PE: 'PEN',
  PK: 'PKR',
  PH: 'PHP',
  PN: 'NZD',
  PL: 'PLN',
  PM: 'EUR',
  ZM: 'ZMK',
  EH: 'MAD',
  EE: 'EUR',
  EG: 'EGP',
  ZA: 'ZAR',
  EC: 'USD',
  IT: 'EUR',
  VN: 'VND',
  SB: 'SBD',
  ET: 'ETB',
  SO: 'SOS',
  ZW: 'ZWL',
  SA: 'SAR',
  ES: 'EUR',
  ER: 'ERN',
  ME: 'EUR',
  MD: 'MDL',
  MG: 'MGA',
  MF: 'EUR',
  MA: 'MAD',
  MC: 'EUR',
  UZ: 'UZS',
  MM: 'MMK',
  ML: 'XOF',
  MO: 'MOP',
  MN: 'MNT',
  MH: 'USD',
  MK: 'MKD',
  MU: 'MUR',
  MT: 'EUR',
  MW: 'MWK',
  MV: 'MVR',
  MQ: 'EUR',
  MP: 'USD',
  MS: 'XCD',
  MR: 'MRO',
  IM: 'GBP',
  UG: 'UGX',
  TZ: 'TZS',
  MY: 'MYR',
  MX: 'MXN',
  IL: 'ILS',
  FR: 'EUR',
  IO: 'USD',
  SH: 'SHP',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NA: 'NAD',
  VU: 'VUV',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NZ: 'NZD',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  CK: 'NZD',
  XK: 'EUR',
  CI: 'XOF',
  CH: 'CHF',
  CO: 'COP',
  CN: 'CNY',
  CM: 'XAF',
  CL: 'CLP',
  CC: 'AUD',
  CA: 'CAD',
  CG: 'XAF',
  CF: 'XAF',
  CD: 'CDF',
  CZ: 'CZK',
  CY: 'EUR',
  CX: 'AUD',
  CR: 'CRC',
  CW: 'ANG',
  CV: 'CVE',
  CU: 'CUP',
  SZ: 'SZL',
  SY: 'SYP',
  SX: 'ANG',
  KG: 'KGS',
  KE: 'KES',
  SS: 'SSP',
  SR: 'SRD',
  KI: 'AUD',
  KH: 'KHR',
  KN: 'XCD',
  KM: 'KMF',
  ST: 'STD',
  SK: 'EUR',
  KR: 'KRW',
  SI: 'EUR',
  KP: 'KPW',
  KW: 'KWD',
  SN: 'XOF',
  SM: 'EUR',
  SL: 'SLL',
  SC: 'SCR',
  KZ: 'KZT',
  KY: 'KYD',
  SG: 'SGD',
  SE: 'SEK',
  SD: 'SDG',
  DO: 'DOP',
  DM: 'XCD',
  DJ: 'DJF',
  DK: 'DKK',
  VG: 'USD',
  DE: 'EUR',
  YE: 'YER',
  DZ: 'DZD',
  US: 'USD',
  UY: 'UYU',
  YT: 'EUR',
  UM: 'USD',
  LB: 'LBP',
  LC: 'XCD',
  LA: 'LAK',
  TV: 'AUD',
  TW: 'TWD',
  TT: 'TTD',
  TR: 'TRY',
  LK: 'LKR',
  LI: 'CHF',
  LV: 'EUR',
  TO: 'TOP',
  LT: 'LTL',
  LU: 'EUR',
  LR: 'LRD',
  LS: 'LSL',
  TH: 'THB',
  TF: 'EUR',
  TG: 'XOF',
  TD: 'XAF',
  TC: 'USD',
  LY: 'LYD',
  VA: 'EUR',
  VC: 'XCD',
  AE: 'AED',
  AD: 'EUR',
  AG: 'XCD',
  AF: 'AFN',
  AI: 'XCD',
  VI: 'USD',
  IS: 'ISK',
  IR: 'IRR',
  AM: 'AMD',
  AL: 'ALL',
  AO: 'AOA',
  AQ: '',
  AS: 'USD',
  AR: 'ARS',
  AU: 'AUD',
  AT: 'EUR',
  AW: 'AWG',
  IN: 'INR',
  AX: 'EUR',
  AZ: 'AZN',
  IE: 'EUR',
  ID: 'IDR',
  UA: 'UAH',
  QA: 'QAR',
  MZ: 'MZN'
}

export const LIMIT_TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: 'disable',
    1: 'primary'
  }
}

export const EMAIL_TEMPLATE_TYPES = {
  ACTIVE_USER: 'Active User',
  IN_ACTIVE_USER: 'In-Active User',
  EMAIL_VERIFICATION: 'Email Verification',
  RESET_PASSWORD: 'Reset Password',
  KYC_REJECTED: 'KYC Rejected',
  KYC_VERIFIED: 'KYC Verified',
  KYC_REQUESTED: 'KYC Requested',
  KYC_REMINDER: 'KYC Reminder',
  KYC_RECEIVED: 'KYC Received',
  KYC_APPROVED: 'KYC Approved',
  WITHDRAW_REQUEST_RECEIVED: 'Redeem Request Received',
  WITHDRAW_APPROVED: 'Redeem Approved',
  DEPOSIT_SUCCESS: 'Purchase Success',
  REGISTRATION_WELCOME: 'Registration Welcome',
  PHONE_VERIFICATION: 'Phone Verification',
  PASSWORD_RESET_CONFIRMED: 'Password Reset Confirmed',
  IDENTITY_VERIFICATION: 'Identity Verification',
  SUCCESSFUL_IDENTITY_VERIFICATION: 'Successful Identity Verification',
  RESPONSIBLE_GAMBLING_PURCHASE_LIMIT: 'Responsible Gaming Purchase Limit',
  RESPONSIBLE_GAMBLING_TAKE_A_BREAK: 'Responsible Gaming Take a Break',
  RESPONSIBLE_GAMBLING_SESSION_REMINDER: 'Responsible Gaming Session Redminder',
  RESPONSIBLE_GAMBLING_TIME_LIMIT: 'Responsible Gaming Time Limit',
  RESPONSIBLE_GAMBLING_SELF_EXCLUSION: 'Responsible Gaming Self Exclusion',
  RESPONSIBLE_GAMBLING_SETTING_CHANGE: 'Responsible Gaming Setting Change',
  VALUE_T0_INT: {
    'Active User': 0,
    'In-Active User': 1,
    'Email Verification': 2,
    'Reset Password': 3,
    'KYC Rejected': 4,
    'KYC Verified': 5,
    'KYC Requested': 6,
    'KYC Reminder': 7,
    'KYC Received': 8,
    'KYC Approved': 9,
    'Redeem Request Received': 10,
    'Redeem Approved': 11,
    'Purchase Success': 12,
    'Registration Welcome': 13,
    'Phone Verification': 14,
    'Password Reset Confirmed': 15,
    'Identity Verification': 16,
    'Successful Identity Verification': 17,
    'Responsible Gaming Purchase Limit': 18,
    'Responsible Gaming Take a Break': 19,
    'Responsible Gaming Session Redminder': 20,
    'Responsible Gaming Time Limit': 21,
    'Responsible Gaming Self Exclusion': 22,
    'Responsible Gaming Setting Change': 23
  },
  INT_TO_VALUE: {
    0: 'Active User',
    1: 'In-Active User',
    2: 'Email Verification',
    3: 'Reset Password',
    4: 'KYC Rejected',
    5: 'KYC Verified',
    6: 'KYC Requested',
    7: 'KYC Reminder',
    8: 'KYC Received',
    9: 'KYC Approved',
    10: 'Redeem Request Received',
    11: 'Redeem Approved',
    12: 'Purchase Success',
    13: 'Registration Welcome',
    14: 'Phone Verification',
    15: 'Password Reset Confirmed',
    16: 'Identity Verification',
    17: 'Successful Identity Verification',
    18: 'Responsible Gaming Purchase Limit',
    19: 'Responsible Gaming Take a Break',
    20: 'Responsible Gaming Session Redminder',
    21: 'Responsible Gaming Time Limit',
    22: 'Responsible Gaming Self Exclusion',
    23: 'Responsible Gaming Setting Change'
  }
}

export const EMAIL_TEMPLATE_ORDER = [
  'Manual',
  'Email Verification',
  'Phone Verification',
  'Registration Welcome',
  'Reset Password',
  'Password Reset Confirmed',
  'Identity Verification',
  'Successful Identity Verification',
  'Responsible Gaming Purchase Limit',
  'Responsible Gaming Take a Break',
  'Responsible Gaming Session Redminder',
  'Responsible Gaming Time Limit',
  'Responsible Gaming Self Exclusion',
  'Responsible Gaming Setting Change',
  'Active User',
  'In-Active User',
  'KYC Verified',
  'KYC Rejected',
  'KYC Requested',
  'KYC Reminder',
  'KYC Received',
  'KYC Approved',
  'Redeem Request Received',
  'Redeem Approved',
  'Purchase Success'
]

export const EMAIL_ALLOWED_KEYS = [
  'SiteName',
  'siteLogo',
  'subject',
  'userName',
  'walletAmountTotal',
  'walletAmountBonus',
  'walletAmountReal',
  'siteUrl',
  'reason',
  'link',
  'redeemAmount',
  'depositAmount',
  'transactionId',
  'playerEmail',
  'playerFullName',
  'playerFirstName',
  'playerLastName',
  'supportEmailAddress',
  'kycLabels',
  'siteLoginUrl',
  'playerCurrencySymbol',
  'sendSupportRequestRoute',
  'redeemRequestedDate',
  'scCoin',
  'gcCoin',
  'currentDate',
  'paymentType',
  'value',
  'identifier'
]

export const EMAIL_TEMPLATES_KEYS = {
  0: {
    required: ['siteName', 'siteUrl', 'siteLogo'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  1: {
    required: ['siteName', 'siteUrl', 'siteLogo', 'reason'],
    optional: [
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal'
    ]
  },
  2: {
    required: ['link', 'userName', 'playerEmail'],
    optional: [
      'siteName',
      'siteUrl',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress'
    ]
  },
  3: {
    required: ['link'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol'
    ]
  },
  4: {
    required: ['kycLabels', 'reason'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  5: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  6: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  7: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  8: {
    required: [],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  9: {
    required: ['kycLabels'],
    optional: [
      'siteName',
      'siteLogo',
      'userName',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  10: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  11: {
    required: [
      'redeemRequestedDate',
      'redeemAmount',
      'transactionId',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  12: {
    required: [
      'transactionId',
      'depositAmount',
      'scCoin',
      'gcCoin',
      'currentDate',
      'paymentType',
      'userName'
    ],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'sendSupportRequestRoute',
      'playerCurrencySymbol'
    ]
  },
  13: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  14: {
    required: ['siteUrl', 'userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  15: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  16: {
    required: ['userName'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  17: {
    required: ['userName', 'siteUrl'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  18: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  19: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  20: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  21: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  22: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  },
  23: {
    required: ['userName', 'currentDate', 'identifier', 'value'],
    optional: [
      'siteName',
      'siteLogo',
      'walletAmountTotal',
      'walletAmountBonus',
      'walletAmountReal',
      'siteUrl',
      'playerEmail',
      'playerFullName',
      'playerFirstName',
      'playerLastName',
      'supportEmailAddress',
      'siteLoginUrl',
      'playerCurrencySymbol',
      'sendSupportRequestRoute'
    ]
  }
}

export const EMAIL_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'subject',
    description: 'If not given, default subject line will be used'
  },
  {
    key: 'userName',
    description: "This will be replaced by User's unique username"
  },
  {
    key: 'walletAmountTotal',
    description: "This will be replaced by User's total wallet amount"
  },
  {
    key: 'walletAmountBonus',
    description: "This will be replaced by User's non-cash wallet amount"
  },
  {
    key: 'walletAmountReal',
    description: "This will be replaced by User's cash wallet amount"
  },
  {
    key: 'siteUrl',
    description: "This will be replaced by site's URL"
  },
  {
    key: 'reason',
    description: 'This will be replaced by valid reason for triggering email'
  },
  {
    key: 'link',
    description:
      'Dynamically generated link from backend (Reset Password, Email Confirmation)'
  },
  {
    key: 'redeemAmount',
    description: 'This will be replaced by redeem request amount'
  },
  {
    key: 'depositAmount',
    description: 'This will be replaced by deposit amount'
  },
  {
    key: 'transactionId',
    description:
      'This will be replaced by transaction Id for (Deposit / Redeem)'
  },
  {
    key: 'playerEmail',
    description: "This will be replaced by player's email address"
  },
  {
    key: 'playerFullName',
    description:
      "This will be replaced by player's full name (first name + last name)"
  },
  {
    key: 'playerFirstName',
    description: "This will be replaced by player's first name"
  },
  {
    key: 'playerLastName',
    description: "This will be replaced by player's last name"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  },
  {
    key: 'kycLabels',
    description:
      'This will be replaced by kyc label for pending, approved, rejected'
  },
  {
    key: 'siteLoginUrl',
    description: 'This will be replaced by user login route'
  },
  {
    key: 'playerCurrencySymbol',
    description: "This will be replaced by user's currency symbol"
  },
  {
    key: 'sendSupportRequestRoute',
    description:
      'This will be replaced by route for compose support email page.'
  },
  {
    key: 'redeemRequestedDate',
    description: 'This will be replaced by requested redeem date.'
  },
  {
    key: 'scCoin',
    description: 'This will be replaced by SC coin value.'
  },
  {
    key: 'gcCoin',
    description: 'This will be replaced by GC coin value.'
  },
  {
    key: 'currentDate',
    description: 'This will be replaced by Current date'
  },
  {
    key: 'paymentType',
    description: 'This will be replaced by payment type used.'
  },
  {
    key: 'value',
    description: 'This will be replaced by deposit value used.'
  },
  {
    key: 'identifier',
    description: 'This will be replaced by identifier used.'
  }
]

export const BONUS_ACTIONS = ['cancel-bonus', 'issue-bonus']

export const CMS_ALLOWED_KEYS = ['siteName', 'siteLogo', 'supportEmailAddress']

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by site's Logo URL"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  }
]

export const MAP_AGGREGATOR = {
  softswiss: 'swissSoft',
  amantic: 'amantic'
}

export const MAP_GENDER = {
  Female: 'f',
  Male: 'm',
  F: 'f',
  M: 'm',
  'Not to say': 'm',
  Other: 'm'
}

export const LEVEL = 1

export const BANNER_KEYS = [
  'homeBanner',
  'homeBackground',
  'loyaltyBanner',
  'loyaltyBackground',
  'promotionsBanner',
  'promotionsBackground',
  'casinoBanner',
  'casinoBackground'
]

export const defaultLanguage = 'EN'

export const BONUS_TYPE = {
  DAILY_BONUS: 'daily bonus',
  WELCOME_BONUS: 'welcome bonus',
  MONTHLY_BONUS: 'monthly bonus',
  POSTAL_CODE_BONUS: 'AMOE Deposit',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  REFERRAL_BONUS: 'referral-bonus',
  TIER_BONUS: 'tier_bonus',
  WEEKLY_RAKEBACK_BONUS: 'weekly_rakeback_bonus',
  PSP_BONUS: 'psp-bonus',
  DEFAULT_BONUS: 'default-bonus',
  BOOST_BONUS: 'boost-bonus',
  SPIN_WHEEL: 'spin-wheel-bonus',
  AD_REWARD_BONUS: 'ad-reward-bonus'
}

export const COUNTRY_CODE_MAPPER = {
  AF: 'AFG',
  AL: 'ALB',
  DZ: 'DZA',
  AS: 'ASM',
  AD: 'AND',
  AO: 'AGO',
  AI: 'AIA',
  AQ: 'ATA',
  AG: 'ATG',
  AR: 'ARG',
  AM: 'ARM',
  AW: 'ABW',
  AU: 'AUS',
  AT: 'AUT',
  AZ: 'AZE',
  BS: 'BHS',
  BH: 'BHR',
  BD: 'BGD',
  BB: 'BRB',
  BY: 'BLR',
  BE: 'BEL',
  BZ: 'BLZ',
  BJ: 'BEN',
  BM: 'BMU',
  BT: 'BTN',
  BO: 'BOL',
  BQ: 'BES',
  BA: 'BIH',
  BW: 'BWA',
  BV: 'BVT',
  BR: 'BRA',
  IO: 'IOT',
  BN: 'BRN',
  BG: 'BGR',
  BF: 'BFA',
  BI: 'BDI',
  CV: 'CPV',
  KH: 'KHM',
  CM: 'CMR',
  CA: 'CAN',
  KY: 'CYM',
  CF: 'CAF',
  TD: 'TCD',
  CL: 'CHL',
  CN: 'CHN',
  CX: 'CXR',
  CC: 'CCK',
  CO: 'COL',
  KM: 'COM',
  CD: 'COD',
  CG: 'COG',
  CK: 'COK',
  CR: 'CRI',
  HR: 'HRV',
  CU: 'CUB',
  CW: 'CUW',
  CY: 'CYP',
  CZ: 'CZE',
  CI: 'CIV',
  DK: 'DNK',
  DJ: 'DJI',
  DM: 'DMA',
  DO: 'DOM',
  EC: 'ECU',
  EG: 'EGY',
  SV: 'SLV',
  GQ: 'GNQ',
  ER: 'ERI',
  EE: 'EST',
  SZ: 'SWZ',
  ET: 'ETH',
  FK: 'FLK',
  FO: 'FRO',
  FJ: 'FJI',
  FI: 'FIN',
  FR: 'FRA',
  GF: 'GUF',
  PF: 'PYF',
  TF: 'ATF',
  GA: 'GAB',
  GM: 'GMB',
  GE: 'GEO',
  DE: 'DEU',
  GH: 'GHA',
  GI: 'GIB',
  GR: 'GRC',
  GL: 'GRL',
  GD: 'GRD',
  GP: 'GLP',
  GU: 'GUM',
  GT: 'GTM',
  GG: 'GGY',
  GN: 'GIN',
  GW: 'GNB',
  GY: 'GUY',
  HT: 'HTI',
  HM: 'HMD',
  VA: 'VAT',
  HN: 'HND',
  HK: 'HKG',
  HU: 'HUN',
  IS: 'ISL',
  IN: 'IND',
  ID: 'IDN',
  IR: 'IRN',
  IQ: 'IRQ',
  IE: 'IRL',
  IM: 'IMN',
  IL: 'ISR',
  IT: 'ITA',
  JM: 'JAM',
  JP: 'JPN',
  JE: 'JEY',
  JO: 'JOR',
  KZ: 'KAZ',
  KE: 'KEN',
  KI: 'KIR',
  KP: 'PRK',
  KR: 'KOR',
  KW: 'KWT',
  KG: 'KGZ',
  LA: 'LAO',
  LV: 'LVA',
  LB: 'LBN',
  LS: 'LSO',
  LR: 'LBR',
  LY: 'LBY',
  LI: 'LIE',
  LT: 'LTU',
  LU: 'LUX',
  MO: 'MAC',
  MG: 'MDG',
  MW: 'MWI',
  MY: 'MYS',
  MV: 'MDV',
  ML: 'MLI',
  MT: 'MLT',
  MH: 'MHL',
  MQ: 'MTQ',
  MR: 'MRT',
  MU: 'MUS',
  YT: 'MYT',
  MX: 'MEX',
  FM: 'FSM',
  MD: 'MDA',
  MC: 'MCO',
  MN: 'MNG',
  ME: 'MNE',
  MS: 'MSR',
  MA: 'MAR',
  MZ: 'MOZ',
  MM: 'MMR',
  NA: 'NAM',
  NR: 'NRU',
  NP: 'NPL',
  NL: 'NLD',
  NC: 'NCL',
  NZ: 'NZL',
  NI: 'NIC',
  NE: 'NER',
  NG: 'NGA',
  NU: 'NIU',
  NF: 'NFK',
  MP: 'MNP',
  NO: 'NOR',
  OM: 'OMN',
  PK: 'PAK',
  PW: 'PLW',
  PS: 'PSE',
  PA: 'PAN',
  PG: 'PNG',
  PY: 'PRY',
  PE: 'PER',
  PH: 'PHL',
  PN: 'PCN',
  PL: 'POL',
  PT: 'PRT',
  PR: 'PRI',
  QA: 'QAT',
  MK: 'MKD',
  RO: 'ROU',
  RU: 'RUS',
  RW: 'RWA',
  RE: 'REU',
  BL: 'BLM',
  SH: 'SHN',
  KN: 'KNA',
  LC: 'LCA',
  MF: 'MAF',
  PM: 'SPM',
  VC: 'VCT',
  WS: 'WSM',
  SM: 'SMR',
  ST: 'STP',
  SA: 'SAU',
  SN: 'SEN',
  RS: 'SRB',
  SC: 'SYC',
  SL: 'SLE',
  SG: 'SGP',
  SX: 'SXM',
  SK: 'SVK',
  SI: 'SVN',
  SB: 'SLB',
  SO: 'SOM',
  ZA: 'ZAF',
  GS: 'SGS',
  SS: 'SSD',
  ES: 'ESP',
  LK: 'LKA',
  SD: 'SDN',
  SR: 'SUR',
  SJ: 'SJM',
  SE: 'SWE',
  CH: 'CHE',
  SY: 'SYR',
  TW: 'TWN',
  TJ: 'TJK',
  TZ: 'TZA',
  TH: 'THA',
  TL: 'TLS',
  TG: 'TGO',
  TK: 'TKL',
  TO: 'TON',
  TT: 'TTO',
  TN: 'TUN',
  TR: 'TUR',
  TM: 'TKM',
  TC: 'TCA',
  TV: 'TUV',
  UG: 'UGA',
  UA: 'UKR',
  AE: 'ARE',
  GB: 'GBR',
  UM: 'UMI',
  US: 'USA',
  UY: 'URY',
  UZ: 'UZB',
  VU: 'VUT',
  VE: 'VEN',
  VN: 'VNM',
  VG: 'VGB',
  VI: 'VIR',
  WF: 'WLF',
  EH: 'ESH',
  YE: 'YEM',
  ZM: 'ZMB',
  ZW: 'ZWE',
  AX: 'ALA'
}

export const DATE_FORMAT = 'yyyy-MM-DD'

export const ACTION = {
  BONUS: 'bonus',
  WIN: 'win',
  BET: 'bet',
  LOST: 'lost',
  CANCEL: 'cancel',
  ROLLBACKBEFOREBETWIN: 'prerollback',
  FREESPINS: 'freespins',
  TIER_BONUS: 'tier_bonus'
}
export const USER_ACTIVITIES_TYPE = {
  SIGNUP: 'sign-up',
  LOGIN: 'login',
  DAILYBONUSCLAIMED: 'daily-bonus-claimed',
  DAILYBONUSCANCELLED: 'daily-bonus-cancelled',
  WELCOMEBONUSCLAIMED: 'welcome-bonus-claimed',
  REFERRED_BONUS_CLAIMED: 'referred-bonus-claimed',
  FIRST_PURCHASE_BONUS: 'first-purchase-bonus',
  LOGOUT: 'logout',
  SPIN_WHEEL: 'spin-wheel-bonus',
  PSP_BONUS: 'psp-bonus',
  BOOST_BONUS: 'boost-bonus',
  TIER_BONUS: 'tier_bonus',
  WEEKLY_RAKEBACK_BONUS: 'weekly_rakeback_bonus',
  AD_REWARD_BONUS: 'ad-reward-bonus'
}

export const ACTION_TYPE = {
  ALL: 'all',
  BONUS: '4',
  LOST: '3',
  CANCEL: '2',
  CREDIT: '1',
  DEBIT: '0',
  PENDING_OR_LOST: null
}

export const LOGICAL_ENTITY = {
  PROVIDER: 'provider',
  SUB_CATEGORY: 'sub-category',
  BANNER: 'banner',
  PACKAGE: 'package',
  USER_PROFILE: 'user-profile'
}
export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const OTP_SEND_LIMIT_EXCEED_ERROR_CODE = 60203

export const PAYMENT_METHOD = {
  CARD: 'CARD',
  APPLEPAY: 'APPLEPAY',
  SKRILL: 'SKRILL'
}

export const REGEX = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{10,}$/
}

export const SEND_EMAIL_TYPES = {
  EMAIL_VERIFICATION: 'email',
  RESET_PASSWORD: 'passwordReset'
}

export const SEND_SMS_TYPES = {
  VERIFICATION_OTP: 'verificationOtp'
}

export const RESPONSIBLE_GAMBLING_STATUS = {
  ACTIVE: '1',
  IN_ACTIVE: '0',
  COOLING_PERIOD: '2'
}

export const RESPONSIBLE_GAMBLING_LIMIT = {
  DAILY: '1',
  WEEKLY: '2',
  MONTHLY: '3'
}

export const RESPONSIBLE_GAMBLING_TYPE = {
  SESSION: '1',
  PURCHASE: '2',
  TIME: '3',
  TIME_BREAK: '4',
  SELF_EXCLUSION: '5'
}

export const SIGN_IN_METHOD = {
  NORMAL: '0',
  GOOGLE: '1',
  FACEBOOK: '2'
}

export const KYC_STATUS = {
  ACCOUNT_CREATED: 'K0',
  ACCOUNT_EMAIL_VERIFIED_ACCEPTED_TC: 'K1',
  ACCOUNT_VERIFIED_PHONE: 'K2',
  ACCOUNT_PASSED_LEXIS_NEXIS: 'K3',
  ACCOUNT_FAILED_LEXIS_NEXIS: 'K4'
}

export const CASINO_ACTION_TYPE = {
  BALANCE: 'balance',
  BET: 'bet',
  WIN: 'win',
  BET_WIN: 'bet_win',
  CANCEL: 'cancel',
  CANCEL_BET_WIN: 'cancel_bet_win'
}

export const CASINO_CALLBACK_STATUS_CODE = {
  200: '200',
  500: '500',
  401: '401'
}
export const CASINO_CALLBACK_ERRORS_CODE = {
  ERR001: 'ERR001',
  ERR002: 'ERR002',
  ERR003: 'ERR003',
  ERR004: 'ERR004',
  ERR005: 'ERR005',
  ERR006: 'ERR006',
  ERR007: 'ERR007',
  ERR008: 'ERR008',
  ERR009: 'ERR009',
  ERR010: 'ERR010'
}

export const CASINO_CALLBACK_ERRORS_MESSAGE = {
  ERR001: 'Unknown error occurred.',
  ERR002: 'The session has timed out. Please login again to continue playing.',
  ERR003:
    'Insufficient funds to place current wager. Please reduce the stake or add more funds to your balance.',
  ERR004:
    'This wagering will exceed your wagering limitation. Please try a smaller amount or increase the limit.',
  ERR005: 'Player authentication failed.',
  ERR006: 'Unauthorized request.',
  ERR007: 'Duplicate transaction request.',
  ERR008: 'Unsupported currency.',
  ERR009: 'Bonus bet max restriction.',
  ERR010: 'Transaction not found.'
}

export const CASINO_DEFAULT_ERROR = {
  status: CASINO_CALLBACK_STATUS_CODE[500],
  error: {
    code: CASINO_CALLBACK_ERRORS_CODE.ERR001,
    message: CASINO_CALLBACK_ERRORS_MESSAGE.ERR001,
    display: true
  }
}

export const THUMBNAIL_TYPE = {
  MOBILE: 'mobile',
  SHORT: 'short',
  LONG: 'long'
}

export const POSTAL_CODE = {
  POSTAL_CODE_TIME: 5, // time in minute
  POSTAL_CODE_VALID_TILL: 15 // time in days
}

export const EMAIL_LOGS_SOURCE = {
  SMS: 'SMS',
  PUSH: 'push',
  TRANSACTIONAL: 'transactional',
  VERIFICATION: 'verification',
  CRM: 'CRM'
}

export const POSTAL_CODE_STATUS = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2
}

export const SIGN_UP_METHOD = {
  EMAIL: 0,
  GOOGLE: 1,
  FACEBOOK: 2
}

export const RULE_ACTIVITIES = {
  REDEMPTIONS: 1,
  LOGIN: 2,
  REGISTRATION: 3,
  PURCHASE: 4,
  WIN: 5
}

export const RULE_NAME = {
  1: 'REDEMPTIONS',
  2: 'LOGIN',
  3: 'REGISTRATION',
  4: 'PURCHASE',
  5: 'WIN'
}

export const RULE_IDENTIFIER = {
  SAME_IP: 'Same ip address during login',
  SAME_DEVICE: 'Same ip address during login',
  SAME_NAME: 'Same last and first name',
  SAME_ADDRESS: 'Same addresses',
  WIN_COUNT: 'Win counts is exceed',
  WIN_SINGLE: 'Single day win amount exceed',
  WIN_SUM: 'Win sum amount exceed',
  PURCHASE_SINGLE: 'Single day purchase amount exceed',
  PURCHASE_SUM: 'Purchase sum amount exceed',
  REDEEM__SINGLE: 'Single day redemption amount exceed',
  REDEEM__SUM: 'Redemption sum amount exceed'
}

export const PAGE_ASSET_TYPE = {
  TEXT: '1',
  DIGITAL: '2',
  MESSAGE: '3'
}

export const HACKSAW_CONST = {
  AUTH: 'Authenticate',
  BALANCE: 'Balance',
  BET: 'Bet',
  WIN: 'Win',
  ROLLBACK: 'Rollback',
  ENDSESSION: 'EndSession'
}

export const VIP_TIER = {
  DEFAULT_TIER: 1
}

export const TRANSACTION_PROVIDER = {
  TRIPLE_A: 'Triple A',
  PAYNOTE: 'Paynote'
}

export const TRIPLE_A_STATUS = {
  NONE: 'none',
  SHORT: 'short',
  HOLD: 'hold',
  GOOD: 'good',
  INVALID: 'invalid',
  NEW: 'new',
  CONFIRM: 'confirm',
  CANCEL: 'cancel'
}

export const PAYNOTE_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed'
}

export const SSN_UPDATE_ALLOWED_COUNT = 5

export const MASTER_CASINO_GAME_PROVIDER = {
  HACKSAW: 'hacksaw',
  BETSOFT: 'betsoft'
}

export const AGGREGATORS = {
  EVOLUTION: 'evolution'
}

export const PROVIDER_ACTION_STATUS = {
  ENABLE: 'ENABLED',
  DISABLE: 'DISABLED'
}

export const PAYNOTE_FAILED_TRANSACTION_COUNT = 5

export const USER_BONUS_LIST_TYPE = {
  ACTIVE: 'active',
  CLAIMED: 'claimed',
  EXPIRED: 'expired'
}

export const CALL_BACK_STATUS = {
  OK: 'OK',
  TEMPORARY_ERROR: 'TEMPORARY_ERROR',
  INVALID_TOKEN_ID: 'INVALID_TOKEN_ID',
  INVALID_SID: 'INVALID_SID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  FATAL_ERROR_CLOSE_USER_SESSION: 'FATAL_ERROR_CLOSE_USER_SESSION',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  BET_DOES_NOT_EXIST: 'BET_DOES_NOT_EXIST',
  BET_ALREADY_EXIST: 'BET_ALREADY_EXIST',
  BET_ALREADY_SETTLED: 'BET_ALREADY_SETTLED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INSUFFICIENT_FUNDS_TIPS: 'INSUFFICIENT_FUNDS_TIPS',
  FINAL_ERROR_ACTION_FAILED: 'FINAL_ERROR_ACTION_FAILED',
  GEOLOCATION_FAIL: 'GEOLOCATION_FAIL',
  BONUS_LIMIT_EXCEEDED: 'BONUS_LIMIT_EXCEEDED',
  MGA: {
    CASINO_LIMIT_EXCEEDED_TURNOVER: 'CASINO_LIMIT_EXCEEDED_TURNOVER',
    CASINO_LIMIT_EXCEEDED_SESSION_TIME: 'CASINO_LIMIT_EXCEEDED_SESSION_TIME',
    CASINO_LIMIT_EXCEEDED_STAKE: 'CASINO_LIMIT_EXCEEDED_STAKE',
    CASINO_LIMIT_EXCEEDED_LOSS: 'CASINO_LIMIT_EXCEEDED_LOSS'
  },
  AAMS: {
    SESSION_ALREADY_CLOSED: 'SESSION_ALREADY_CLOSED',
    SESSION_DOES_NOT_EXIST: 'SESSION_DOES_NOT_EXIST',
    OPERATION_IN_PROCESS: 'OPERATION_IN_PROCESS'
  }
}


const ASSETS = 'assets'

export const S3_FILE_PREFIX = {
  bonus: ASSETS + '/bonus',
  profileImage: ASSETS + '/profileImage',
  casino_game: ASSETS + '/casino/games',
  casino_provider: ASSETS + '/casino/providers',
  casino_category: ASSETS + '/casino/categories',
  promotions: ASSETS + '/promotions',
  siteLogo: ASSETS + '/site_information/logo',
  banner: ASSETS + '/site_information/banner',
  imageGallery: ASSETS + '/gallery',
  gif: ASSETS + '/gif'
}