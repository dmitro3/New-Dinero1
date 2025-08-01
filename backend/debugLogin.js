const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_WRITE_HOST || process.env.DB_READ_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false
});

async function debugLogin() {
  try {
    console.log('🔍 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Check if test user exists
    console.log('\n📋 Checking test user...');
    const user = await sequelize.query(`
      SELECT user_id, username, first_name, last_name, is_active, is_email_verified
      FROM users WHERE username = 'testuser'
    `, { type: Sequelize.QueryTypes.SELECT });

    if (user.length === 0) {
      console.log('❌ Test user not found!');
      return;
    }
    console.log('✅ Test user found:', user[0]);

    // Check user details
    console.log('\n📋 Checking user details...');
    const userDetails = await sequelize.query(`
      SELECT * FROM user_details WHERE user_id = $1
    `, { 
      bind: [user[0].user_id],
      type: Sequelize.QueryTypes.SELECT 
    });

    if (userDetails.length === 0) {
      console.log('❌ User details not found!');
    } else {
      console.log('✅ User details found:', userDetails[0]);
    }

    // Check wallet
    console.log('\n📋 Checking wallet...');
    const wallet = await sequelize.query(`
      SELECT * FROM wallets WHERE user_id = $1
    `, { 
      bind: [user[0].user_id],
      type: Sequelize.QueryTypes.SELECT 
    });

    if (wallet.length === 0) {
      console.log('❌ Wallet not found!');
    } else {
      console.log('✅ Wallet found:', wallet[0]);
    }

    // Check VIP tiers
    console.log('\n📋 Checking VIP tiers...');
    const vipTiers = await sequelize.query(`
      SELECT * FROM vip_tiers LIMIT 5
    `, { type: Sequelize.QueryTypes.SELECT });

    if (vipTiers.length === 0) {
      console.log('❌ No VIP tiers found in database!');
    } else {
      console.log('✅ VIP tiers found:', vipTiers.length);
      console.log('Sample VIP tier:', vipTiers[0]);
    }

    // Check if user has VIP tier assigned
    if (userDetails.length > 0) {
      console.log('\n📋 Checking user VIP tier assignment...');
      const userVipTier = await sequelize.query(`
        SELECT v.* FROM vip_tiers v 
        JOIN user_details ud ON v.vip_tier_id = ud.vip_tier_id 
        WHERE ud.user_id = $1
      `, { 
        bind: [user[0].user_id],
        type: Sequelize.QueryTypes.SELECT 
      });

      if (userVipTier.length === 0) {
        console.log('❌ User has no VIP tier assigned!');
        console.log('💡 Need to assign a VIP tier to user_details.vip_tier_id');
      } else {
        console.log('✅ User VIP tier found:', userVipTier[0]);
      }
    }

    console.log('\n🎯 Summary:');
    console.log('- User exists:', user.length > 0);
    console.log('- User details exist:', userDetails.length > 0);
    console.log('- Wallet exists:', wallet.length > 0);
    console.log('- VIP tiers exist:', vipTiers.length > 0);
    console.log('- User has VIP tier:', userDetails.length > 0 && userDetails[0].vip_tier_id);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

debugLogin(); 