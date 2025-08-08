# 1GameHub Integration Guide

## Overview
This guide covers the integration of 1GameHub platform into your casino system. The integration is already partially implemented and needs to be configured with the correct environment variables.

## Current Implementation Status

### ✅ Already Implemented
- Game launch service (`oneGameHubGameLaunchUrl.service.js`)
- Bet/Win/Balance/Cancel handlers
- Callback controller (`one.game.hub.casino.controller.js`)
- Routes configuration (`oneGameHubCasino.routes.js`)
- Constants and error handling
- Session management with Redis
- Currency mapping (SSC ↔ SC, GOC ↔ GC)

### 🔧 Configuration Required
- Environment variables setup
- API endpoints configuration
- HMAC validation setup

## Required Environment Variables

Add these to your `.env` file:

```bash
# 1GameHub Configuration
GAMEHUB1_EMAI=your_email@example.com
GAMEHUB1_PASSWORD=your_password
GAMEHUB1_BASE_URL=https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc
GAMEHUB1_SECRET_TOKEN=6073bd4b-d0ab-4710-959e-faedd33135ed
GAMEHUB1_HMAC_SALT=your_hmac_salt_here
```

## API Endpoints Configuration

Based on your screenshot, here are the endpoints that need to be configured:

### 1. Games List
```
GET https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=available_games&secret=6073bd4b-d0ab-4710-959e-faedd33135ed
```

### 2. Demo Play
```
GET https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=demo_play&game_id={game_id}&secret=6073bd4b-d0ab-4710-959e-faedd33135ed
```

### 3. Real Play
```
GET https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=real_play&game_id={game_id}&currency={currency}&player_id={player_id}&secret=6073bd4b-d0ab-4710-959e-faedd33135ed
```

### 4. Freerounds Create
```
GET https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc?action=freerounds_create&secret=6073bd4b-d0ab-4710-959e-faedd33135ed
```

## Integration Steps

### Step 1: Update Environment Variables
1. Copy the environment variables above to your `.env` file
2. Replace the placeholder values with your actual 1GameHub credentials
3. Restart your backend server

### Step 2: Verify Configuration
Run this command to check if the configuration is loaded correctly:

```bash
node -e "
const config = require('./src/configs/app.config').default;
console.log('1GameHub Config:');
console.log('Base URL:', config.get('gameHub1.baseUrl'));
console.log('Secret Token:', config.get('gameHub1.secretToken') ? 'SET' : 'NOT_SET');
console.log('HMAC Salt:', config.get('gameHub1.hmacSalt') ? 'SET' : 'NOT_SET');
"
```

### Step 3: Test Game Launch
Test the game launch functionality:

```bash
# Test with a valid user and game
curl -X GET "http://localhost:5000/api/v1/casino/play-game?gameId=1&coinType=SC&isDemo=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Test Callbacks
Test the callback endpoints:

```bash
# Test balance callback
curl -X POST "http://localhost:5000/api/v1/casino/one-game-hub?action=balance" \
  -H "Content-Type: application/json" \
  -d '{"currency":"SSC","player_id":"onegh-123_1234567890"}'
```

## Current Issues and Fixes

### Issue 1: Missing Environment Variables
**Problem**: 1GameHub configuration not loaded
**Solution**: Add the required environment variables to your `.env` file

### Issue 2: API URL Mismatch
**Problem**: Current implementation uses different URL structure
**Solution**: Update the `oneGameHubGameLaunchUrl.service.js` to match your API structure

### Issue 3: HMAC Validation
**Problem**: HMAC validation might be failing
**Solution**: Ensure `GAMEHUB1_HMAC_SALT` is properly configured

## Code Updates Needed

### 1. Update Game Launch Service
The current implementation might need updates to match your exact API structure:

```javascript
// In oneGameHubGameLaunchUrl.service.js
const url = isDemo === 'true'
  ? `${baseUrl}?action=${actionType}&secret=${secretToken}&game_id=${providerCasinoGameId}&currency=USD&ip_address=${defaultIp}`
  : `${baseUrl}?action=${actionType}&secret=${secretToken}&player_id=${sessionId}&game_id=${providerCasinoGameId}&currency=${currency}&ip_address=${defaultIp}`;
```

### 2. Add Missing Actions
If you need freerounds support, add the missing action:

```javascript
// In public.constants.js
export const ONE_GAME_HUB_REQUEST_ACTIONS = {
  // ... existing actions
  FREEROUNDS_CREATE: "freerounds_create",
  FREEROUNDS_CANCEL: "freerounds_cancel",
};
```

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Game launch works for demo mode
- [ ] Game launch works for real mode
- [ ] Balance callbacks work
- [ ] Bet callbacks work
- [ ] Win callbacks work
- [ ] Cancel callbacks work
- [ ] HMAC validation works
- [ ] Session management works
- [ ] Currency mapping works correctly

## Troubleshooting

### Common Issues

1. **"Configuration not loaded" error**
   - Check if environment variables are set correctly
   - Restart the backend server after updating `.env`

2. **"Invalid HMAC signature" error**
   - Verify `GAMEHUB1_HMAC_SALT` is correct
   - Check the validation middleware

3. **"Game not found" error**
   - Verify the game exists in your database
   - Check if the `casinoGameId` matches the 1GameHub game ID

4. **"Session timeout" error**
   - Check Redis connection
   - Verify session caching is working

## Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple demo game first
4. Contact 1GameHub support for API-specific issues 