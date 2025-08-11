import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}

const config = convict({
  app: {
    name: {
      doc: 'trueIGtech User BE',
      format: String,
      default: 'trueIGtech User BE'
    },
    appName: {
      doc: 'Name of the application',
      format: String,
      default: 'trueIGtech User',
      env: 'APP_NAME'
    },
    userFrontendUrl: {
      doc: 'User Frontend Url',
      format: String,
      default: '',
      env: 'USER_FRONTEND_URL'
    },
    userBackendUrl: {
      doc: 'User Backend Url',
      format: String,
      default: '',
      env: 'USER_BACKEND_URL'
    },
    adminBackendUrl: {
      default: '',
      env: 'ADMIN_BACKEND_URL'
    },
    origin: {
      default: '',
      env: 'ALLOWED_ORIGIN'
    },
  },
  alea: {
    casino_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_ID'
    },
    casino_pp_sc_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_PP_SC_ID'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_KEY'
    },
    secret_pp_key: {
      format: String,
      default: '',
      env: 'ALEA_PP_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'ALEA_BASE_URL'
    },
    secret_token: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_TOKEN'
    },
    environment_id: {
      format: String,
      default: '',
      env: 'ALEA_ENVIRONMENT_ID'
    },
    pp_environment_id: {
      format: String,
      default: '',
      env: 'ALEA_PP_ENVIRONMENT_ID'
    }
  },
  gameHub1: {
    email: {
      default: '',
      env: 'GAMEHUB1_EMAI'
    },
    password: {
      default: '',
      env: 'GAMEHUB1_PASSWORD'
    },
    baseUrl: {
      default: '',
      env: 'GAMEHUB1_BASE_URL'
    },
    secretToken: {
      default: '',
      env: 'GAMEHUB1_SECRET_TOKEN'
    },
    hmacSalt: {
      default: '',
      env: 'GAMEHUB1_HMAC_SALT'
    }
  },
  basic: {
    username: {
      doc: 'basic username for authentication middleware.',
      default: 'admin',
      env: 'BASIC_USERNAME'
    },
    password: {
      doc: 'basic password for authentication middleware.',
      default: 'admin',
      env: 'BASIC_PASSWORD'
    }
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging'],
    default: 'development',
    env: 'NODE_ENV'
  },
  credentialsEncryptionKey: {
    default: '',
    env: 'CREDENTIAL_ENCRYPTION_KEY'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 4000,
    env: 'PORT'
  },
  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },
  sequelize: {
    name: {
      default: 'test_db',
      env: 'DB_NAME'
    },
    user: {
      default: 'dev_test',
      env: 'DB_USER'
    },
    password: {
      default: '123456',
      env: 'DB_PASSWORD'
    },
    readHost: {
      default: 'localhost',
      env: 'DB_READ_HOST'
    },
    writeHost: {
      default: 'localhost',
      env: 'DB_WRITE_HOST'
    },
    port: {
      default: 5433,
      env: 'DB_PORT'
    },
    sync: {
      default: false,
      env: 'DB_SYNC'
    }
  },

  redis: {
    host: {
      default: 'localhost',
      env: 'REDIS_HOST'
    },
    port: {
      default: 6379,
      env: 'REDIS_PORT'
    },
    password: {
      default: '',
      env: 'REDIS_PASSWORD'
    }
  },
  socket: {
    encryptionKey: {
      default: '',
      env: 'SOCKET_ENCRYPTION_KEY'
    },
    maxPerUserConnection: {
      default: 2,
      env: 'SOCKET_MAX_PER_USER_CONNECTION'
    }
  },
  jwt: {
    tokenSecret: {
      default: '',
      env: 'JWT_LOGIN_SECRET'
    },
    tokenExpiry: {
      default: '1d',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    },
    resetPasswordKey: {
      default: '',
      env: 'RESET_PASSWORD_KEY'
    },
    emailTokenExpiry: {
      default: '',
      env: 'EMAIL_TOKEN_EXPIRY'
    },
    emailTokenKey: {
      default: '',
      env: 'EMAIL_TOKEN_KEY'
    }
  },
  windowAge: {
    default: 1000 * 60 * 5,
    env: 'WINDOW_AGE'
  },
  microService: {
    accessToken: {
      default: '',
      env: 'MICRO_SERVICE_ACCESS_TOKEN'
    }
  },
  email: {
    mailjetApiKey: {
      default: '',
      env: 'MAILJET_API_KEY'
    },
    mailjetSecretKey: {
      default: '',
      env: 'MAILJET_SECRET_KEY'
    },
    senderName: {
      default: 'GS Casino',
      env: 'EMAIL_SENDER_NAME'
    },
    senderEmail: {
      default: 'parthiv@pervadorit.com',
      env: 'EMAIL_SENDER_EMAIL'
    }
  },
  veriff: {
    baseUrl: {
      doc: 'Veriff Url',
      default: '',
      env: 'VERIFF_URL'
    },
    secretKey: {
      doc: 'Veriif secret key',
      default: '',
      env: 'VERIFF_SECRET_KEY'
    },
    apiKey: {
      doc: 'veriff api key',
      default: '',
      env: 'VERIFF_API_KEY'
    }
  },
  mailGun: {
    apiKey: {
      default: '',
      env: 'MAILGUN_API_KEY'
    },
    domain: {
      default: '',
      env: 'MAILGUN_DOMAIN'
    },
    senderEmail: {
      default: '',
      env: 'SENDER_EMAIL'
    }
  },
  coinFlow: {
    apiKey: {
      doc: 'API key of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_API_KEY'
    },
    baseUrl: {
      doc: 'API key of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_BASE_URL'
    },
    baseOriginUrl: {
      doc: 'API key of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_BASE_ORIGIN_URL'
    },
    merchantId:{
      doc: 'merchantId of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_MERCHANT_ID'
    },
    authHeader:{
      doc: 'merchantId of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_AUTH_HEADER'
    },
    wallet: {
      doc: 'wallet key of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_WALLET'
    },
    blockchain: {
      doc: 'blockchain key of coin flow payment',
      format: String,
      default: '',
      env: 'COIN_FLOW_PAYMENT_BLOCK_CHAIN'
    },
    plaidCredentials: {
      plaidClientId: {
        format: String,
        default: '',
        env: 'PLAID_CLIENT_ID'
      },
      plaidSecret: {
        format: String,
        default: '',
        env: 'PLAID_SECRET'
      }
    }
  },
  nowPayment: {
    ipnSecretKey: {
      doc: 'IPN Secret Key of nowpayment',
      format: String,
      default: '',
      env: 'PAYMENT_IPN_SECRET_KEY'
    },
    apiKey: {
      doc: 'API key of nowpayment',
      format: String,
      default: '',
      env: 'PAYMENT_API_KEY'
    },
    url: {
      doc: 'Domain URL of nowpayment',
      format: String,
      default: '',
      env: 'PAYMENT_URL'
    },
    email: {
      doc: 'Nowpayment Email',
      format: String,
      default: '',
      env: 'PAYMENT_EMAIL'
    },
    password: {
      doc: 'Nowpayment Password',
      format: String,
      default: '',
      env: 'PAYMENT_PASSWORD'
    }
  },
  gsoft: {
    startGameUrl: {
      default: '',
      env: 'GSOFT_START_GAME_URL'
    },
    operatorId: {
      default: '',
      env: 'GSOFT_OPERATOR_ID'
    },
    sinatraUrl: {
      default: '',
      env: 'GSOFT_SINATRA_URL'
    },
    licence: {
      default: '',
      env: 'GSOFT_LICENCE'
    }
  },
  aws: {
    bucket: {
      default: '',
      env: 'AWS_BUCKET'
    },
    region: {
      default: 'us-east-1',
      env: 'AWS_REGION'
    },
    accessKeyId: {
      default: '',
      env: 'AWS_ACCESS_KEY'
    },
    secretAccessKey: {
      default: '',
      env: 'AWS_SECRET_ACCESS_KEY'
    }
  },
  geoapi: {
    url: {
      default: 'https://api.ipgeolocation.io/ipgeo',
      env: 'IPGEO_URL'
    },
    apikey: {
      default: '',
      env: 'IPGEO_API_KEY'
    }
  }
})

config.validate({ allowed: 'strict' })

module.exports = config
