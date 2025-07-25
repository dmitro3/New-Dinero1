const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google SSO
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // On success, redirect to frontend with JWT token
  const token = req.user.token;
  res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?token=${token}`);
});

// Facebook SSO
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  // On success, redirect to frontend with JWT token
  const token = req.user.token;
  res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?token=${token}`);
});

module.exports = router; 