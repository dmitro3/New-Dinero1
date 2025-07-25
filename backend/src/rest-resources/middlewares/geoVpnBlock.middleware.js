const axios = require('axios');
// Proton VPN Free supports US, NL (Netherlands), JP (Japan)
// For testing, block all US states and NL, JP countries
const blockedRegions = [
  // Block all US states for testing
  { country: 'US', state: 'AL' }, { country: 'US', state: 'AK' }, { country: 'US', state: 'AZ' }, { country: 'US', state: 'AR' },
  { country: 'US', state: 'CA' }, { country: 'US', state: 'CO' }, { country: 'US', state: 'CT' }, { country: 'US', state: 'DE' },
  { country: 'US', state: 'FL' }, { country: 'US', state: 'GA' }, { country: 'US', state: 'HI' }, { country: 'US', state: 'ID' },
  { country: 'US', state: 'IL' }, { country: 'US', state: 'IN' }, { country: 'US', state: 'IA' }, { country: 'US', state: 'KS' },
  { country: 'US', state: 'KY' }, { country: 'US', state: 'LA' }, { country: 'US', state: 'ME' }, { country: 'US', state: 'MD' },
  { country: 'US', state: 'MA' }, { country: 'US', state: 'MI' }, { country: 'US', state: 'MN' }, { country: 'US', state: 'MS' },
  { country: 'US', state: 'MO' }, { country: 'US', state: 'MT' }, { country: 'US', state: 'NE' }, { country: 'US', state: 'NV' },
  { country: 'US', state: 'NH' }, { country: 'US', state: 'NJ' }, { country: 'US', state: 'NM' }, { country: 'US', state: 'NY' },
  { country: 'US', state: 'NC' }, { country: 'US', state: 'ND' }, { country: 'US', state: 'OH' }, { country: 'US', state: 'OK' },
  { country: 'US', state: 'OR' }, { country: 'US', state: 'PA' }, { country: 'US', state: 'RI' }, { country: 'US', state: 'SC' },
  { country: 'US', state: 'SD' }, { country: 'US', state: 'TN' }, { country: 'US', state: 'TX' }, { country: 'US', state: 'UT' },
  { country: 'US', state: 'VT' }, { country: 'US', state: 'VA' }, { country: 'US', state: 'WA' }, { country: 'US', state: 'WV' },
  { country: 'US', state: 'WI' }, { country: 'US', state: 'WY' }
];
const blockedCountries = ['NL', 'JP']; // Block Netherlands and Japan for Proton VPN free

async function geoVpnBlockMiddleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geoApiKey = process.env.IPGEO_API_KEY; // Get a free key from ipgeolocation.io

  try {
    // Get geo info
    const geoRes = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${ip}`);
    const { country_code2, state_prov } = geoRes.data;

    // Block by country
    if (blockedCountries.includes(country_code2)) {
      return res.status(403).json({ error: 'Access from your country is not allowed.' });
    }

    // Block by US state
    if (country_code2 === 'US' && blockedRegions.some(r => r.state === state_prov)) {
      return res.status(403).json({ error: 'Access from your state is not allowed.' });
    }

    // VPN/Proxy check (as before)
    const vpnApiKey = process.env.IPQUALITYSCORE_API_KEY;
    if (vpnApiKey) {
      const vpnUrl = `https://ipqualityscore.com/api/json/ip/${vpnApiKey}/${ip}`;
      const { data } = await axios.get(vpnUrl);
      if (data.vpn || data.proxy || data.tor) {
        return res.status(403).json({ error: 'VPN/Proxy detected. Please disable it to access the service.' });
      }
    }

    next();
  } catch (err) {
    console.error('Geo/VPN check failed:', err.message);
    next(); // Optionally block on error, or allow
  }
}

module.exports = geoVpnBlockMiddleware; 