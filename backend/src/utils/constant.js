import CryptoJS from 'crypto-js'

import config from '../configs/app.config'
import { POSTAL_CODE } from './constants/constants'

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  SUPERADMIN: 'superadmin',
  SYSTEM: 'system'
}

export const TYPE = {
  CRYPTO: 'CRYPTO',
  FIAT: 'FIAT',
  CRYPTO_ID: 0,
  FIAT_ID: 1
}

// Veriff staus constant
export const VERIFF_STATUS = {
  REQUESTED: 'requested',
  APPROVED: 'approved',
  DECLINED: 'declined',
}

// Document constants start
export const DOCUMENT_STATUS_TYPES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUESTED: 'requested'
}


export const DOCUMENT_TYPES = {
  VERIFF: 'veriff',
  OTHER: 'other'
}

export const EMAIL_TEMPLATE_PRIMARY_STATUS = {
  PRIMARY: 1,
  DISABLE: 0,
  alias: {
    0: 'disable',
    1: 'primary'
  }
}


export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'successful',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  ROLLBACK: 'rollback',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUESTED: 'requested'
}


export const PAYMENT_STATUS = {
  SUCCESS: 'SUCCESSFUL',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  WAITING_INPUT: 'WAITING_INPUT',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  WAITING_WITHDRAWAL_APPROVAL: 'WAITING_WITHDRAWAL_APPROVAL'
}

export const PAYMENT_PROVIDER = {
  INOVIO: 'INOVIO',
  NOWPAYMENT: 'NowPayment',
  COINFLOW: 'CoinFlow',
  APPROVELY: 'Approvely',
  OFFLINE: 'Offline'
}

export const TRANSACTION_STATUS_CASINO = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  ROLLBACK: 3
}

export const MAP_GENDER = {
  Female: 'f',
  Male: 'm',
  F: 'f',
  M: 'm',
  Other: 'm'
}

export const EMAIL_SUBJECTS = {
  EN: {
    verification: 'Let\'s Get You Started: Please Verify Your Account',
    userActivate: 'Your Account is verified welcome to Our World',
    userDeactivate: 'Your Account is Deactivated',
    kycRejected: 'Your KYC Didn\'t Pass! We Need Your Quick Action',
    kycVerified: 'Great News! Your KYC Approval is Here',
    kycRequested: 'Just One More Step: Documents Requested for KYC Completion',
    reset: 'Time for a Fresh Start: Reset Your Password Now',
    deposit_success: 'Success! Your Deposit Has Arrived',
    deposit_failed: 'Oops! Your Deposit Failed - Let\'s Sort It Out',
    withdraw_request_received: 'We\'ve Got Your Withdrawal Request: What\'s Next?',
    withdraw_request_approved: 'Good News! Your Withdrawal Request is Approved',
    withdraw_request_processed: 'It\'s on Its Way: Your Withdrawal Request is Now Processed',
    passwordUpdated: 'Congrats! Your Password Has Been Updated Successfully',
    joiningBonus: 'Congrats! You have received Joining Bonus'
  },
  DE: {
    verification: 'Lassen Sie uns anfangen: Bitte überprüfen Sie Ihr Konto',
    userActivate: 'Ihr Konto ist verifiziert, willkommen in unserer Welt',
    userDeactivate: 'Ihr Konto ist deaktiviert',
    kycRejected: 'Ihre KYC ist nicht durchgekommen! Wir brauchen Ihre schnelle Aktion',
    kycVerified: 'Tolle Neuigkeiten! Ihre KYC-Genehmigung ist hier',
    kycRequested: 'Nur noch ein Schritt: Dokumente für die KYC-Vollendung angefordert',
    reset: 'Zeit für einen Neuanfang: Setzen Sie Ihr Passwort jetzt zurück',
    deposit_success: 'Erfolg! Ihre Einzahlung ist eingetroffen',
    deposit_failed: 'Hoppla! Ihre Einzahlung ist fehlgeschlagen - Lassen Sie uns das klären',
    withdraw_request_received: 'Wir haben Ihre Auszahlungsanfrage erhalten: Was kommt als Nächstes?',
    withdraw_request_approved: 'Gute Nachrichten! Ihre Auszahlungsanfrage wurde genehmigt',
    withdraw_request_processed: 'Es ist auf dem Weg: Ihre Auszahlungsanfrage wird jetzt bearbeitet',
    passwordUpdated: 'Herzlichen Glückwunsch! Ihr Passwort wurde erfolgreich aktualisiert',
    joiningBonus: 'Congrats! You have received Joining Bonus'
  },
  FR: {
    verification: 'Commençons: Veuillez vérifier votre compte',
    userActivate: 'Votre compte est vérifié, bienvenue dans notre monde',
    userDeactivate: 'Votre compte est désactivé',
    kycRejected: 'Votre KYC n\'a pas réussi! Nous avons besoin de votre action rapide',
    kycVerified: 'Bonne nouvelle! Votre approbation KYC est ici',
    kycRequested: 'Juste une étape de plus: documents demandés pour l\'achèvement du KYC',
    reset: 'Temps pour un nouveau départ: réinitialisez votre mot de passe maintenant',
    deposit_success: 'Succès! Votre dépôt est arrivé',
    deposit_failed: 'Oups! Votre dépôt a échoué - Réglons cela',
    withdraw_request_received: 'Nous avons reçu votre demande de retrait: Quelle est la prochaine étape?',
    withdraw_request_approved: 'Bonne nouvelle! Votre demande de retrait est approuvée',
    withdraw_request_processed: 'C\'est en route: Votre demande de retrait est maintenant traitée',
    passwordUpdated: 'Félicitations! Votre mot de passe a été mis à jour avec succès',
    joiningBonus: 'Congrats! You have received Joining Bonus'
  },
  FI: {
    verification: 'Aloitetaan: Vahvista tilisi',
    userActivate: 'Tilisi on vahvistettu, tervetuloa maailmaamme',
    userDeactivate: 'Tilisi on poistettu käytöstä',
    kycRejected: 'KYC:si ei mennyt läpi! Tarvitsemme nopeaa toimintaa',
    kycVerified: 'Hyviä uutisia! KYC-hyväksyntäsi on tässä',
    kycRequested: 'Vielä yksi askel: asiakirjoja pyydetään KYC:n valmiiksi saattamiseksi',
    reset: 'Aika uudelle alulle: Nollaa salasanasi nyt',
    deposit_success: 'Onnistui! Talletuksesi on saapunut',
    deposit_failed: 'Hups! Talletuksesi epäonnistui - Selvitetään se',
    withdraw_request_received: 'Olemme saaneet nostopyyntösi: Mitä seuraavaksi?',
    withdraw_request_approved: 'Hyviä uutisia! Nostopyyntösi on hyväksytty',
    withdraw_request_processed: 'Se on matkalla: Nostopyyntösi on nyt käsitelty',
    passwordUpdated: 'Onnittelut! Salasanasi on päivitetty onnistuneesti',
    joiningBonus: 'Congrats! You have received Joining Bonus'
  },
  NO: {
    verification: 'La oss komme i gang: Vennligst bekreft kontoen din',
    userActivate: 'Kontoen din er bekreftet, velkommen til vår verden',
    userDeactivate: 'Kontoen din er deaktivert',
    kycRejected: 'Din KYC gikk ikke gjennom! Vi trenger din raske handling',
    kycVerified: 'Gode nyheter! Din KYC-godkjenning er her',
    kycRequested: 'Bare ett skritt til: Dokumenter bedt om for KYC-ferdigstillelse',
    reset: 'Tid for en frisk start: Tilbakestill passordet ditt nå',
    deposit_success: 'Suksess! Innskuddet ditt har kommet',
    deposit_failed: 'Oops! Innskuddet ditt mislyktes - La oss ordne det',
    withdraw_request_received: 'Vi har mottatt uttaksforespørselen din: Hva skjer videre?',
    withdraw_request_approved: 'Gode nyheter! Uttaksforespørselen din er godkjent',
    withdraw_request_processed: 'Det er på vei: Uttaksforespørselen din behandles nå',
    passwordUpdated: 'Gratulerer! Passordet ditt er oppdatert',
    joiningBonus: 'Congrats! You have received Joining Bonus'
  }
}

export const OK = 'ok'
export const LIMIT = 10
export const SUCCESS = 'success'
export const UPLOAD_FILE_SIZE = 1000000
export const UPLOAD_DOCUMENT_SIZE = 2000000
export const LEVEL = 1

export const BONUS_TYPE = {
  BALANCE: 'balance',
  FREESPINS: 'freespins',
  DEPOSIT: 'deposit',
  JOINING: 'joining',
  WAGERING: 'wagering',
  PROMOTION: 'promotion',
  SPIN_WHEEL: 'spin_wheel'
}

export const ACTION = {
  WIN: 'win',
  BET: 'bet',
  ROLLBACK: 'rollback',
  ROLLBACKBEFOREBETWIN: 'prerollback',
  FREESPINS: 'freespins',
  BETINTERNAL: 'betInternal',
  WININTERNAL: 'winInternal'
}

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  BONUS: 'bonus',
  BONUS_TO_CASH: 'bonusToCash',
  FORFEIT: 'bonusForfeit',
  EXPIRED: 'bonusExpired',
  ADD_BALANCE: 'addMoney',
  REMOVE_BALANCE: 'removeMoney',
  BONUS_REFERRAL: 'bonusReferral',
  INTERNAL: {
    deposit: 'depositInternal',
    withdraw: 'withdrawInternal',
    reversal: 'reversalInternal',
    debit: 'debitInternal',
    credit: 'creditInternal'
  },
  REVERSAL: 'reversal',
  DEBIT: 'debit',
  CREDIT: 'credit'
}

export const AMOUNT_TYPE = {
  CASH: 0,
  NON_CASH: 1,
  CASH_NON_CASH: 2
}

export const WEB_SOCKET_CODE = {
  UPDATEWALLET: 'UPDATEWALLET',
  PAYMENTSTATUS: 'PAYMENTSTATUS'
}

export const STATUS_VALUE = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  COMPLETED: 'COMPLETED'
}

export const STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELLED: 3,
  REREQUESTED: 4
}

export const BONUS_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FORFEIT: 'FORFEITED',
  EXPIRED: 'EXPIRED',
  CLAIMING: 'CLAIMING',
  IN_PROCESS: 'IN-PROCESS',
  LAPSED: 'LAPSED'
}

export const WAGERING_TYPE = {
  BONUS: 'bonus',
  BONUSDEPOSIT: 'bonusdeposit'
}

export const KEYS = {
  MAX_BONUS_THRESHOLD: 'maxBonusThreshold',
  MIN_DEPOSIT: 'minDeposit',
  MAX_WIN_AMOUNT: 'maxWinAmount',
  ZERO_OUT_THRESHOLD: 'zeroOutThreshold',
  MIN_BALANCE: 'minBalance',
  JOINING_AMOUNT: 'joiningAmount'
}

export const WAGER_STATUS = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export const TIME_PERIOD = {
  DAILY: 1,
  WEEKLY: 7,
  MONTHLY: 30
}

export const BREAK_TYPE = {
  TAKE_A_BREAK: 'TAKE_A_BREAK',
  SELF_EXCLUSION: 'SELF_EXCLUSION'
}

export const SELF_EXCLUSION_TYPE = {
  CURRENT: 'current',
  ALL: 'all'
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
  WITHDRAW_REQUEST_RECEIVED: 'Withdraw Request Received',
  WITHDRAW_APPROVED: 'Withdraw Approved',
  WITHDRAW_PROCESSED: 'Withdraw Processed',
  DEPOSIT_SUCCESS: 'Deposit Success',
  DEPOSIT_FAILED: 'Deposit Failed',
  REGISTRATION_WELCOME: 'Registration Welcome',
  GAMBLING_STATUS_REGISTRATION: 'Gambling Status Registration',
  UPDATE_PASSWORD: 'Password Updated',
  JOINING_BONUS: 'Joining Bonus',
  OTP_VERIFICATION: 'Please verify your email by entering the given OTP',
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
    'Withdraw Request Received': 10,
    'Withdraw Approved': 11,
    'Withdraw Processed': 12,
    'Deposit Success': 13,
    'Deposit Failed': 14,
    'Registration Welcome': 15,
    'Gambling Status Registration': 16,
    'Password Updated': 17,
    'Joining Bonus': 18
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
    10: 'Withdraw Request Received',
    11: 'Withdraw Approved',
    12: 'Withdraw Processed',
    13: 'Deposit Success',
    14: 'Deposit Failed',
    15: 'Registration Welcome',
    16: 'Gambling Status Registration',
    17: 'Password Updated',
    18: 'Joining Bonus'
  }
}

export const LIMIT_TIME_PERIOD = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const ACCOUNT_TYPE = {
  REAL: 'REAL',
  INTERNAL: 'INTERNAL'
}

export const CMS_ALLOWED_KEYS = [
  'siteName',
  'siteLogo',
  'supportEmailAddress'
]

export const CMS_DYNAMIC_OPTIONS = [
  {
    key: 'siteName',
    description: 'This will be replaced by Site name'
  },
  {
    key: 'siteLogo',
    description: "This will be replaced by Site's Logo URL"
  },
  {
    key: 'supportEmailAddress',
    description: 'This will be replaced by support email address'
  },
  {
    key: 'siteUrl',
    description: 'This will be replaced by Site domain'
  }
]

export const DEFAULT_LANGUAGE = 'EN'

export const COUNTRY_CODE_MAPPER = { AF: 'AFG', AL: 'ALB', DZ: 'DZA', AS: 'ASM', AD: 'AND', AO: 'AGO', AI: 'AIA', AQ: 'ATA', AG: 'ATG', AR: 'ARG', AM: 'ARM', AW: 'ABW', AU: 'AUS', AT: 'AUT', AZ: 'AZE', BS: 'BHS', BH: 'BHR', BD: 'BGD', BB: 'BRB', BY: 'BLR', BE: 'BEL', BZ: 'BLZ', BJ: 'BEN', BM: 'BMU', BT: 'BTN', BO: 'BOL', BQ: 'BES', BA: 'BIH', BW: 'BWA', BV: 'BVT', BR: 'BRA', IO: 'IOT', BN: 'BRN', BG: 'BGR', BF: 'BFA', BI: 'BDI', CV: 'CPV', KH: 'KHM', CM: 'CMR', CA: 'CAN', KY: 'CYM', CF: 'CAF', TD: 'TCD', CL: 'CHL', CN: 'CHN', CX: 'CXR', CC: 'CCK', CO: 'COL', KM: 'COM', CD: 'COD', CG: 'COG', CK: 'COK', CR: 'CRI', HR: 'HRV', CU: 'CUB', CW: 'CUW', CY: 'CYP', CZ: 'CZE', CI: 'CIV', DK: 'DNK', DJ: 'DJI', DM: 'DMA', DO: 'DOM', EC: 'ECU', EG: 'EGY', SV: 'SLV', GQ: 'GNQ', ER: 'ERI', EE: 'EST', SZ: 'SWZ', ET: 'ETH', FK: 'FLK', FO: 'FRO', FJ: 'FJI', FI: 'FIN', FR: 'FRA', GF: 'GUF', PF: 'PYF', TF: 'ATF', GA: 'GAB', GM: 'GMB', GE: 'GEO', DE: 'DEU', GH: 'GHA', GI: 'GIB', GR: 'GRC', GL: 'GRL', GD: 'GRD', GP: 'GLP', GU: 'GUM', GT: 'GTM', GG: 'GGY', GN: 'GIN', GW: 'GNB', GY: 'GUY', HT: 'HTI', HM: 'HMD', VA: 'VAT', HN: 'HND', HK: 'HKG', HU: 'HUN', IS: 'ISL', IN: 'IND', ID: 'IDN', IR: 'IRN', IQ: 'IRQ', IE: 'IRL', IM: 'IMN', IL: 'ISR', IT: 'ITA', JM: 'JAM', JP: 'JPN', JE: 'JEY', JO: 'JOR', KZ: 'KAZ', KE: 'KEN', KI: 'KIR', KP: 'PRK', KR: 'KOR', KW: 'KWT', KG: 'KGZ', LA: 'LAO', LV: 'LVA', LB: 'LBN', LS: 'LSO', LR: 'LBR', LY: 'LBY', LI: 'LIE', LT: 'LTU', LU: 'LUX', MO: 'MAC', MG: 'MDG', MW: 'MWI', MY: 'MYS', MV: 'MDV', ML: 'MLI', MT: 'MLT', MH: 'MHL', MQ: 'MTQ', MR: 'MRT', MU: 'MUS', YT: 'MYT', MX: 'MEX', FM: 'FSM', MD: 'MDA', MC: 'MCO', MN: 'MNG', ME: 'MNE', MS: 'MSR', MA: 'MAR', MZ: 'MOZ', MM: 'MMR', NA: 'NAM', NR: 'NRU', NP: 'NPL', NL: 'NLD', NC: 'NCL', NZ: 'NZL', NI: 'NIC', NE: 'NER', NG: 'NGA', NU: 'NIU', NF: 'NFK', MP: 'MNP', NO: 'NOR', OM: 'OMN', PK: 'PAK', PW: 'PLW', PS: 'PSE', PA: 'PAN', PG: 'PNG', PY: 'PRY', PE: 'PER', PH: 'PHL', PN: 'PCN', PL: 'POL', PT: 'PRT', PR: 'PRI', QA: 'QAT', MK: 'MKD', RO: 'ROU', RU: 'RUS', RW: 'RWA', RE: 'REU', BL: 'BLM', SH: 'SHN', KN: 'KNA', LC: 'LCA', MF: 'MAF', PM: 'SPM', VC: 'VCT', WS: 'WSM', SM: 'SMR', ST: 'STP', SA: 'SAU', SN: 'SEN', RS: 'SRB', SC: 'SYC', SL: 'SLE', SG: 'SGP', SX: 'SXM', SK: 'SVK', SI: 'SVN', SB: 'SLB', SO: 'SOM', ZA: 'ZAF', GS: 'SGS', SS: 'SSD', ES: 'ESP', LK: 'LKA', SD: 'SDN', SR: 'SUR', SJ: 'SJM', SE: 'SWE', CH: 'CHE', SY: 'SYR', TW: 'TWN', TJ: 'TJK', TZ: 'TZA', TH: 'THA', TL: 'TLS', TG: 'TGO', TK: 'TKL', TO: 'TON', TT: 'TTO', TN: 'TUN', TR: 'TUR', TM: 'TKM', TC: 'TCA', TV: 'TUV', UG: 'UGA', UA: 'UKR', AE: 'ARE', GB: 'GBR', UM: 'UMI', US: 'USA', UY: 'URY', UZ: 'UZB', VU: 'VUT', VE: 'VEN', VN: 'VNM', VG: 'VGB', VI: 'VIR', WF: 'WLF', EH: 'ESH', YE: 'YEM', ZM: 'ZMB', ZW: 'ZWE', AX: 'ALA' }

export const PAYMENT_CATEGORY = {
  CREDITCARD: 'CREDITCARD',
  WALLET: 'WALLET',
  CRYPTO: 'CRYPTO',
  OTHER: 'OTHER',
  INSTANTBANKING: 'INSTANTBANKING'
}

export const TRANSACTION_MESSAGE = {
  EN: 'We have successfully received your deposit request, which is currently being processed by our provider. If the deposit request is approved and processed successfully, the deposited amount should be available in your account within approximately 15 minutes.',
  DE: 'Wir haben Ihre Einzahlungsanforderung erfolgreich erhalten, die derzeit von unserem Anbieter verarbeitet wird. Wenn die Einzahlungsanforderung erfolgreich genehmigt und verarbeitet wird, sollte der eingezahlte Betrag innerhalb von etwa 15 Minuten auf Ihrem Konto verfügbar sein.',
  FR: 'Nous avons bien reçu votre demande de dépôt, qui est actuellement en cours de traitement par notre fournisseur. Si la demande de dépôt est approuvée et traitée avec succès, le montant déposé devrait être disponible sur votre compte dans environ 15 minutes.',
  FI: 'Olemme vastaanottaneet talletuspyyntösi onnistuneesti, ja se on parhaillaan palveluntarjoajamme käsittelyssä. Jos talletuspyyntö hyväksytään ja se käsitellään onnistuneesti, talletettu summa pitäisi olla saatavilla tililläsi noin 15 minuutin kuluessa.',
  NO: 'Vi har mottatt innskuddsforspørselen din, som for øyeblikket behandles av vår leverandør. Hvis innskuddsforspørselen blir godkjent og behandlet vellykket, bør det innskudde beløpet være tilgjengelig på kontoen din innen omtrent 15 minutter.'
}

export const AMOUNT_DEPOSITED = {
  EN: 'Deposit Amount Attempted',
  DE: 'Versuchter Einzahlungsbetrag',
  FR: 'Montant de dépôt tenté',
  FI: 'Yritetty talletussumma',
  NO: 'Forsøkt innskuddsbeløp'
}

export const RECEIPT_MESSAGES = {
  transactionId: {
    EN: 'Transaction Id',
    DE: 'Transaktions-ID',
    FR: 'Identifiant de transaction',
    FI: 'Tapahtumatunnus',
    NO: 'Transaksjons-ID'
  },
  account: {
    EN: 'Account',
    DE: 'Konto',
    FR: 'Compte',
    FI: 'Tili',
    NO: 'Konto'
  },
  paymentReference: {
    EN: 'Payment Reference',
    DE: 'Zahlungsreferenz',
    FR: 'Référence de paiement',
    FI: 'Maksuviite',
    NO: 'Betalingsreferanse'
  },
  amountWithdrawn: {
    EN: 'Amount Withdrawn from player account',
    DE: 'Abgehobener Betrag vom Spielerkonto',
    FR: 'Montant retiré du compte du joueur',
    FI: 'Pelaajatililtä nostettu määrä',
    NO: 'Beløp trukket fra spillerkonto'
  },
  withdrawFee: {
    EN: 'Withdrawal Fee',
    DE: 'Abhebungsgebühr',
    FR: 'Frais de retrait',
    FI: 'Nostopalkkio',
    NO: 'Uttaksgebyr'
  },
  amountToBeDeposit: {
    EN: 'Amount That Will be deposited to your account',
    DE: 'Betrag, der auf Ihr Konto eingezahlt wird',
    FR: 'Montant qui sera déposé sur votre compte',
    FI: 'Summa, joka talletetaan tilillesi',
    NO: 'Beløp som vil bli satt inn på kontoen din'
  },
  withdrawId: {
    EN: 'Withdrawal Transaction Id',
    DE: 'Auszahlungs-Transaktions-ID',
    FR: 'Identifiant de transaction de retrait',
    FI: 'Nostotapahtuman tunnus',
    NO: 'Uttakstransaksjons-ID'
  },
  pspAccount: {
    EN: 'PSP Account',
    DE: 'PSP-Konto',
    FR: 'Compte PSP',
    FI: 'PSP-tili',
    NO: 'PSP-konto'
  }
}


export const NUTECH_API_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export const BRAND_NAME = 'gamma'
export const NA = 'not_available'

export const SIGN_IN_TYPE = {
  NORMAL: 'Normal',
  GOOGLE: 'Google',
  FACEBOOK: 'Facebook',
  LINE: 'Line',
  TWITCH: 'Twitch',
  OTHER: 'Other'
}

export const AFFLIATE_REQUEST_TYPE = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REREQUESTED: 'REREQUESTED'
}

export const PRAGMATIC_PLAY = {
  GAME_AGGREGATOR: 'Pragmatic Play',
  GAME_PROVIDER: 'Pragmatic Play',
  CATERGORY: 'Casino',
  SUB_CATEGORY: {
    CLASSIC_SLOTS: 'Classic Slots',
    VIDEO_SLOTS: 'Video Slots',
    LIVE_GAMES: 'Live games',
    BACCARAT: 'Baccarat',
    BACCARAT_NEW: 'Baccarat New',
    ROULETTE: 'Roulette',
    SCRACH_CARD: 'Scratch card'
  }
}

export const EVOLUTION = {
  GAME_AGGREGATOR: 'Evolution',
  GAME_PROVIDER: 'Evolution',
  CATERGORY: 'Casino'
  // SUB_CATEGORY: {
  //   CLASSIC_SLOTS: 'Classic Slots',
  //   VIDEO_SLOTS: 'Video Slots',
  //   LIVE_GAMES: 'Live games',
  //   BACCARAT: 'Baccarat',
  //   BACCARAT_NEW: 'Baccarat New',
  //   ROULETTE: 'Roulette',
  //   SCRACH_CARD: 'Scratch card'
  // }
}


export const JWT_TOKEN_TYPES = {
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot_password'
}


export const GLOBAL_SETTING = {
  FAUCET_SETTING: 'FAUCET_SETTING',
  POSTAL_CODE: 'POSTAL_CODE',
  WITHDRAWAL_LIMITS: 'WITHDRAWAL_LIMITS',
  SOCIAL_MEDIA_LINKS: "SOCIAL_MEDIA_LINKS"
}
