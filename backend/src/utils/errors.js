export const ERRORS = {
  BAD_DATA: 'BadData',
  INTERNAL: 'Internal',
  NOT_FOUND: 'NotFound',
  FORBIDDEN: 'Forbidden',
  BAD_REQUEST: 'BadRequest',
  SERVER_ERROR: 'ServerError',
  CACHE_FAILED: 'cache failed',
  UNAUTHORIZED: 'Unauthorized',
  SERVICE_FAILED: 'service failed',
  METHOD_NOT_ALLOWED: 'MethodNotAllowed',
  SERVER_UNAVAILABLE: 'ServerUnavailable',
  EXPECTATION_FAILED: 'ExpectationFailed'
}

export const APP_ERROR_CODES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Access token is invalid',
  EMAIL_NOT_VERIFIED: 'Email is not verified',
  AUTHORIZATION_ERROR: 'Authorization required',
  INCORRECT_PASSWORD: 'This password is incorrect',
  INCORRECT_CREDENTIAL: 'This email/password is incorrect',
  INACTIVE_ADMIN: 'Cannot login, current user is in-active'
}

export const ERROR_MSG = {
  FAILED: 'failed',
  EXISTS: 'already exists',
  NOT_EXISTS: 'does not exists',
  NOT_FOUND: 'Record not found',
  PAYMENT_FAILED: 'Payment Failed',
  VERIFY_EMAIL: 'Verify your email',
  UPDATE_DAILY_LIMIT: 'Cannot update ',
  EMAIL_TOKEN_EXPIRED: 'Email expired',
  SERVER_ERROR: 'Something went wrong',
  BALANCE_ERROR: 'Insufficient balance',
  DOMAIN_ERROR: 'Domain not registered',
  BONUS_ISSUE: 'Bonus cannot be issued.',
  BONUS_CLAIM: 'Bonus cannot be claimed.',
  SENDGRID_ERROR: 'Unable to send email.',
  BONUS_DELETE: 'Bonus Cannot be deleted.',
  TRANSACTION_FAILED: 'Transaction failed',
  EMAIL_VERIFIED: 'Email already verified',
  USERNAME_EXIST: 'Username already exists',
  NOT_ALLOWED: 'this action is not allowed',
  EMAIL_EXIST: 'Email Address already exist',
  EMAIL_ERROR: 'Unable to verify your email',
  USER_DISABLE_UNTIL: 'User is disabled until ', // Don't remove last space
  EXCEED_DAILY_LIMIT: 'Daily bet limit reached ',
  CURRENCY_REQUIRED: 'Currency code is required',
  UNIQUE_KEY_EXISTS: 'Unique key already exists.',
  EXTERNAL_API_ERROR: 'External api response error',
  SESSION_ERROR: 'Invalid session or session expired',
  LANGUAGE_NOT_ALLOWED: 'This language is not allowed',
  ASK_TENANT: 'Ask your tenant to verify your account',
  WITHDRAW_ERR: 'Request Failed, request already pending',
  BONUS_AVAIL: 'Bonus cannot be activated, try again later',
  UPDATE_DAILY_LIMIT_TENANT: 'Max value for daily limit is ',
  INVALID_BONUS: 'Amount can be issued only in deposit Bonus',
  BONUS_VALIDITY: 'You can activate this bonus on or after ',
  TIME_LIMIT_ERROR: 'Session Time can be set between 1 to 24',
  LOYALTY_LEVEL_NOT_FOUND: 'Loyalty level settings not found',
  CASHBACK_ERROR: 'To claim, cash balance should be less than ',
  RESET_PASSWORD_TOKEN_EXPIRED: 'Reset password email expired',
  CASHBACK_LAPSED: 'You did not have enough losses to get cashback',
  ASK_TENANT_RESET_PASSWORD: 'Ask your tenant to reset your password',
  CURRENCY_NOT_SUBSET: 'Currency should be as per allowed configuration',
  TAKE_A_BREAK_DAY_ERROR: 'Days for take a break can be in range 1 to 30',
  USER_BONUS: 'Action cannot be performed, bonus is claimed by user itself.',
  KYC_ERROR: 'Your KYC status is not APPROVED, you cannot perform this action',
  REQUEST_EXISTS: 'Bonus cannot be claimed, pending withdrawal requests exists.',
  ACTIVE_BONUS: 'You already have an availed bonus, to continue forfeit it first',
  PROVIDER_INACTIVE: 'Payment Provider is in-active or not supported for your region.',
  EMMITTER_ERROR: 'Emmitor Error.'
}

export const ERROR_CODE = {
  TRANSACTION_FAILED: 101,
  BAD_REQUEST: 400
}
