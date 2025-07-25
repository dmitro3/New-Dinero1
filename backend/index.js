import { createServer } from 'http'
import config from '@src/configs/app.config'
import app from '@src/rest-resources'
import socketServer from '@src/socket-resources'
import gracefulShutDown from '@src/libs/gracefulShutDown'
import { Logger } from '@src/libs/logger'
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('./src/db/models');
const jwt = require('jsonwebtoken');

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

httpServer.listen({ port: config.get('port') }, () => {
  Logger.info('Server Started', { message: `Listening On ${config.get('port')}` })
})

process.on('SIGTERM', gracefulShutDown)
process.on('SIGINT', gracefulShutDown)
process.on('SIGUSR2', gracefulShutDown)
