const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * Google SSO
 * - Only request profile (no email scope)
 * - Redirect back to frontend with token
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const token = req.user.token; // token is set in strategy
      res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?token=${token}`);
    } catch (error) {
      console.error('Google SSO callback error:', error);
      res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?error=sso_failed`);
    }
  }
);

/**
 * Facebook SSO
 * - Only request public_profile (no email scope)
 * - Redirect back to frontend with token
 */
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    try {
      const token = req.user.token; // token is set in strategy
      res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?token=${token}`);
    } catch (error) {
      console.error('Facebook SSO callback error:', error);
      res.redirect(`${process.env.SSO_SUCCESS_REDIRECT}?error=sso_failed`);
    }
  }
);

module.exports = router;
