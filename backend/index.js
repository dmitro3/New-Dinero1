import { createServer } from 'http';
import config from '@src/configs/app.config';
import app from '@src/rest-resources';
import socketServer from '@src/socket-resources';
import gracefulShutDown from '@src/libs/gracefulShutDown';
import { Logger } from '@src/libs/logger';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import db from '@src/db/models';
import { UserLoginHandler } from '@src/services/user/userLogin.handler';
import { UserSignUpHandler } from '@src/services/user';
import { getRequestIP } from '@src/utils/common';
import { createAccessToken } from '@src/helpers/authentication.helpers';

// =============== GOOGLE STRATEGY ===============
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const ip = getRequestIP(req);
      const context = { sequelizeTransaction: null, req };

      try {
        let user = await db.User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // New user → signup
          const { user: newUser } = await UserSignUpHandler.execute(
            {
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              email: profile.emails?.[0]?.value || null,
              username:
                profile.emails?.[0]?.value?.split('@')[0] || `google_${profile.id}`,
              googleId: profile.id,
              signInType: 'GOOGLE',
              language: 'en',
              ipAddress: ip,
            },
            context
          );
          user = newUser;
        } else {
          // Existing user → login
          const { user: loggedInUser } = await UserLoginHandler.execute(
            { googleId: profile.id, signInType: 'GOOGLE', ipAddress: ip },
            context
          );
          user = loggedInUser;
        }
        const jwtToken = await createAccessToken(user);
        const safeUser = typeof user.toJSON === "function" ? user.toJSON() : user;

        return done(null, { ...safeUser, token: jwtToken });
      } catch (err) {
        console.error('Google SSO error:', err);
        return done(err, null);
      }
    }
  )
);

// =============== FACEBOOK STRATEGY ===============
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name'],
      passReqToCallback: true, // ✅ added so we also get req for IP
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const ip = getRequestIP(req);
      const context = { sequelizeTransaction: null, req };

      try {
        let user = await db.User.findOne({ where: { facebookId: profile.id } });

        if (!user) {
          // New user → signup
          const { user: newUser } = await UserSignUpHandler.execute(
            {
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              email: profile.emails?.[0]?.value || null,
              username:
                profile.emails?.[0]?.value?.split('@')[0] ||
                `facebook_${profile.id}`,
              facebookId: profile.id,
              signInType: 'FACEBOOK',
              language: 'en',
              ipAddress: ip,
            },
            context
          );
          user = newUser;
        } else {
          const { user: loggedInUser } = await UserLoginHandler.execute(
            { facebookId: profile.id, signInType: 'FACEBOOK', ipAddress: ip },
            context
          );
          user = loggedInUser;
        }
        const jwtToken = await createAccessToken(user);
        const safeUser = typeof user.toJSON === "function" ? user.toJSON() : user;

        return done(null, { ...safeUser, token: jwtToken });
      } catch (err) {
        console.error('Facebook SSO error:', err);
        return done(err, null);
      }
    }
  )
);

app.use(passport.initialize());

const httpServer = createServer(app);
socketServer.attach(httpServer);

// ==================== DB Connection Test ====================
const testDatabaseConnection = async () => {
  try {
    Logger.info('Database Configuration:', {
      database: config.get('sequelize.name'),
      user: config.get('sequelize.user'),
      readHost: config.get('sequelize.readHost'),
      writeHost: config.get('sequelize.writeHost'),
      port: config.get('sequelize.port'),
      env: config.get('env'),
    });

    Logger.info('Attempting database connection...');
    await db.sequelize.authenticate();
    Logger.info('✅ Database Connected Successfully');
    return true;
  } catch (error) {
    Logger.error('❌ Database Connection Failed', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });

    console.error('Full Database Error:', error);
    return false;
  }
};

// ==================== SERVER STARTUP ====================
const startServer = async () => {
  const port = config.get('port') || process.env.PORT || 5000;
  const env = config.get('env') || process.env.NODE_ENV || 'development';
  const dbName =
    config.get('sequelize.name') || process.env.DB_NAME || 'unknown';

  Logger.info('🚀 Starting server initialization...');
  Logger.info('⚙️  Server Configuration:', { port, env, dbName });

  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    Logger.error('Server startup failed due to database connection error');
    process.exit(1);
  }

  httpServer.listen({ port }, () => {
    Logger.info(`🚀 Backend Server is running on port: ${port}`);
    Logger.info(`📡 API Base URL: http://localhost:${port}`);
    Logger.info('🌐 Environment:', env);
  });
};

startServer();

process.on('SIGTERM', gracefulShutDown);
process.on('SIGINT', gracefulShutDown);
process.on('SIGUSR2', gracefulShutDown);
