const axios = require('axios');

// Configuration from environment variables
const GEO_BLOCKING_ENABLED = process.env.GEO_BLOCKING_ENABLED !== 'false';
const VPN_DETECTION_ENABLED = process.env.VPN_DETECTION_ENABLED !== 'false';
const GEO_BLOCKING_FALLBACK = process.env.GEO_BLOCKING_FALLBACK || 'allow';
const GEO_API_TIMEOUT = parseInt(process.env.GEO_API_TIMEOUT) || 5000;

// Proton VPN Free supports US, NL (Netherlands), JP (Japan)
// For testing, block all US states and NL, JP countries
const blockedRegions = [
  { country: 'US', state: 'MI' },
  { country: 'US', state: 'ID' },
  { country: 'US', state: 'WA' },
  { country: 'US', state: 'LA' },
  { country: 'US', state: 'NV' },
  { country: 'US', state: 'MT' },
  { country: 'US', state: 'CT' },
  { country: 'US', state: 'HI' },
  { country: 'US', state: 'DE' },
  // { country: 'IN', state: 'GJ' } // Gujarat for testing 
];
const blockedCountries = ['MX']; // Block Mexico

async function geoVpnBlockMiddleware(req, res, next) {
  // Skip if geolocation blocking is disabled
  if (!GEO_BLOCKING_ENABLED) {
    return next();
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geoApiKey = process.env.IPGEO_API_KEY;

  // Skip if no API key is configured
  if (!geoApiKey) {
    console.warn('IPGEO_API_KEY not configured, skipping geolocation check');
    return next();
  }

  try {
    // Get geo info with timeout
    const geoRes = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${ip}`, {
      timeout: GEO_API_TIMEOUT
    });
    const { country_code2, state_prov, state_code } = geoRes.data;

    // Block by country
    if (blockedCountries.includes(country_code2)) {
      return res.status(403).json({ error: 'Access from your region is not allowed.' });
    }

    // Block by US state
    if (country_code2 === 'US' && blockedRegions.some(r => r.state === state_prov)) {
      return res.status(403).json({ error: 'Access from your region is not allowed.' });
    }

    // Add special Gujarat block logic:
    // Block by India state (Gujarat) (commented out for now)
    // if (
    //   country_code2 === 'IN' && (
    //     state_prov === 'Gujarat' ||
    //     state_code === 'GJ' ||
    //     blockedRegions.some(r => r.country === 'IN' && (r.state === state_prov || r.state === state_code))
    //   )
    // ) {
    //   return res.status(403).json({ error: 'Access from your region is not allowed.' });
    // }

    // VPN/Proxy check
    if (VPN_DETECTION_ENABLED) {
      const vpnApiKey = process.env.IPQUALITYSCORE_API_KEY;
      if (vpnApiKey) {
        const vpnUrl = `https://ipqualityscore.com/api/json/ip/${vpnApiKey}/${ip}`;
        const { data } = await axios.get(vpnUrl, { timeout: GEO_API_TIMEOUT });
        if (data.vpn || data.proxy || data.tor) {
          return res.status(403).json({ error: 'VPN/Proxy detected. Please disable it to access the service.' });
        }
      }
    }

    next();
  } catch (err) {
    console.error('Geo/VPN check failed:', err.message);
    
    // Handle fallback based on configuration
    if (GEO_BLOCKING_FALLBACK === 'block') {
      return res.status(403).json({ error: 'Geolocation check failed. Access denied.' });
    } else if (GEO_BLOCKING_FALLBACK === 'allow_on_error') {
      console.warn('Geolocation check failed, allowing access as fallback');
      return next();
    } else {
      // Default: allow on error
      console.warn('Geolocation check failed, allowing access as fallback');
      return next();
    }
  }
}

module.exports = geoVpnBlockMiddleware; 