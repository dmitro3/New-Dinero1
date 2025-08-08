# 1GameHub Integration Setup Summary

## 🎯 Quick Setup Steps

### 1. Environment Variables (Required)
Add these to your `.env` file:

```bash
# 1GameHub Configuration
GAMEHUB1_EMAI=your_email@example.com
GAMEHUB1_PASSWORD=your_password
GAMEHUB1_BASE_URL=https://site-ire1.1gamehub.com/integrations/dinerosweeps/rpc
GAMEHUB1_SECRET_TOKEN=6073bd4b-d0ab-4710-959e-faedd33135ed
GAMEHUB1_HMAC_SALT=your_hmac_salt_here
```

### 2. What's Already Implemented ✅
- ✅ Game launch service (demo & real mode)
- ✅ Bet/Win/Balance/Cancel handlers
- ✅ Callback controller
- ✅ Routes configuration
- ✅ Session management with Redis
- ✅ Currency mapping (SSC ↔ SC, GOC ↔ GC)
- ✅ Error handling and constants

### 3. What You Need to Do 🔧

1. **Set Environment Variables**
   - Copy the variables above to your `.env` file
   - Replace placeholder values with your actual credentials
   - Restart your backend server

2. **Test the Integration**
   ```bash
   # Test configuration
   node test-1gamehub.js
   
   # Test game launch
   curl -X GET "http://localhost:5000/api/v1/casino/play-game?gameId=1&coinType=SC&isDemo=true" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Verify Database**
   - Ensure you have 1GameHub games in your `casino_games` table
   - Check that `casino_providers` table has 1GameHub provider
   - Verify `casino_aggregators` table has 1GameHub aggregator

### 4. API Endpoints Available

#### Game Launch
- **Demo**: `GET /api/v1/casino/play-game?gameId=1&coinType=SC&isDemo=true`
- **Real**: `GET /api/v1/casino/play-game?gameId=1&coinType=SC&isDemo=false`

#### Callbacks
- **Balance**: `POST /api/v1/casino/one-game-hub?action=balance`
- **Bet**: `POST /api/v1/casino/one-game-hub?action=bet`
- **Win**: `POST /api/v1/casino/one-game-hub?action=win`
- **Cancel**: `POST /api/v1/casino/one-game-hub?action=cancel`

### 5. Troubleshooting

#### Common Issues:
1. **"Configuration not loaded"**
   - Check if environment variables are set
   - Restart server after updating `.env`

2. **"Game not found"**
   - Verify game exists in database
   - Check `casinoGameId` matches 1GameHub game ID

3. **"Invalid HMAC signature"**
   - Verify `GAMEHUB1_HMAC_SALT` is correct
   - Check validation middleware

4. **"Session timeout"**
   - Check Redis connection
   - Verify session caching is working

### 6. Testing Checklist

- [ ] Environment variables set correctly
- [ ] Configuration loads without errors
- [ ] Demo game launch works
- [ ] Real game launch works
- [ ] Balance callbacks work
- [ ] Bet callbacks work
- [ ] Win callbacks work
- [ ] Cancel callbacks work
- [ ] HMAC validation works
- [ ] Session management works

### 7. Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple demo game first
4. Contact 1GameHub support for API-specific issues

## 🎮 Ready to Go!

Once you've completed the setup steps above, your 1GameHub integration should be fully functional. The integration supports both demo and real money play, with proper session management and callback handling. 