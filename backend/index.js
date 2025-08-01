import { createServer } from 'http'
import config from '@src/configs/app.config'
import app from '@src/rest-resources'
import socketServer from '@src/socket-resources'
import gracefulShutDown from '@src/libs/gracefulShutDown'
import { Logger } from '@src/libs/logger'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
import db from '@src/db/models'
import jwt from 'jsonwebtoken'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await db.User.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await db.User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        signInType: 'google',
        isEmailVerified: true
      });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_LOGIN_SECRET, { expiresIn: '1d' });
    user.token = token;
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await db.User.findOne({ where: { facebookId: profile.id } });
    if (!user) {
      user = await db.User.create({
        facebookId: profile.id,
        email: profile.emails ? profile.emails[0].value : null,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        signInType: 'facebook',
        isEmailVerified: true
      });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_LOGIN_SECRET, { expiresIn: '1d' });
    user.token = token;
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

app.use(passport.initialize());

const httpServer = createServer(app)

socketServer.attach(httpServer)

// Test database connection before starting server
const testDatabaseConnection = async () => {
  try {
    // Log database configuration
    Logger.info('Database Configuration:', {
      database: config.get('sequelize.name'),
      user: config.get('sequelize.user'),
      readHost: config.get('sequelize.readHost'),
      writeHost: config.get('sequelize.writeHost'),
      port: config.get('sequelize.port'),
      env: config.get('env')
    })

    // Log environment variables
    Logger.info('Environment Variables:', {
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_READ_HOST: process.env.DB_READ_HOST,
      DB_WRITE_HOST: process.env.DB_WRITE_HOST,
      DB_PORT: process.env.DB_PORT,
      NODE_ENV: process.env.NODE_ENV
    })

    Logger.info('Attempting database connection...')
    await db.sequelize.authenticate()
    Logger.info('Database Connected Successfully')
    return true
  } catch (error) {
    Logger.error('Database Connection Failed', { 
      error: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    })
    
    // Log additional error details
    console.error('Full Database Error:', error)
    console.error('Error Code:', error.code)
    console.error('Error Message:', error.message)
    console.error('Error Stack:', error.stack)
    
    return false
  }
}

// Start server only after database connection is established
const startServer = async () => {
  const port = config.get('port') || process.env.PORT || 5000
  const env = config.get('env') || process.env.NODE_ENV || 'development'
  const dbName = config.get('sequelize.name') || process.env.DB_NAME || 'unknown'
  
  Logger.info('🚀 Starting server initialization...')
  Logger.info('⚙️  Server Configuration:')
  Logger.info('   - Port:', port)
  Logger.info('   - Environment:', env)
  Logger.info('   - Database:', dbName)
  
  const dbConnected = await testDatabaseConnection()
  
  if (!dbConnected) {
    Logger.error('Server startup failed due to database connection error')
    process.exit(1)
  }

  httpServer.listen({ port: port }, () => {
    Logger.info('🚀 Backend Server is running on port:', port)
    Logger.info('📡 API Base URL: http://localhost:' + port)
    Logger.info('🌐 Environment:', env)
  })
}

startServer()

process.on('SIGTERM', gracefulShutDown)
process.on('SIGINT', gracefulShutDown)
process.on('SIGUSR2', gracefulShutDown)
