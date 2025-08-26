const axios = require("axios");

const GEO_BLOCKING_ENABLED = process.env.GEO_BLOCKING_ENABLED;
const VPN_DETECTION_ENABLED = process.env.VPN_DETECTION_ENABLED;
const GEO_BLOCKING_FALLBACK = process.env.GEO_BLOCKING_FALLBACK;
const GEO_API_TIMEOUT = parseInt(process.env.GEO_API_TIMEOUT);

// Blocked U.S. states
const blockedStates = ["MI", "ID", "WA", "LA", "NV", "MT", "CT", "HI", "DE"];

// Countries that are allowed
const allowedCountries = ["US", "IN"];

const US_STATE_NAME_TO_CODE = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

function normalizeStateCode(stateCode, stateName) {
  if (stateCode) {
    let code = stateCode.toUpperCase();
    if (code.includes("-")) code = code.split("-").pop();
    return code;
  }
  if (stateName) {
    return US_STATE_NAME_TO_CODE[stateName.trim()] || stateName.toUpperCase();
  }
  return null;
}

function isBlockedRegion(country, stateCode) {
  if (!allowedCountries.includes(country)) return true; // Only allow US + IN

  if (country === "IN") return false; // India always allowed

  if (country === "US" && blockedStates.includes(stateCode)) {
    return true; // Block listed states
  }

  return false; // Other US states allowed
}

async function geoVpnBlockMiddleware(req, res, next) {
  if (!GEO_BLOCKING_ENABLED) return next();

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.connection?.remoteAddress?.replace(/^.*:/, "");

  console.log(`[Geo/VPN Middleware] Detected IP: ${ip}`);

  const geoApiKey = process.env.IPGEO_API_KEY;
  if (!geoApiKey) {
    console.warn("IPGEO_API_KEY not configured, skipping geolocation check");
    return next();
  }

  try {
    const geoRes = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${geoApiKey}&ip=${ip}`,
      { timeout: GEO_API_TIMEOUT }
    );

    const { country_code2, state_prov, state_code, city } = geoRes.data;
    const normalizedStateCode = normalizeStateCode(state_code, state_prov);

    console.log(`[Geo] IP: ${ip} | Country: ${country_code2} | State: ${normalizedStateCode} | City: ${city}`);

    if (isBlockedRegion(country_code2, normalizedStateCode)) {
      return res.status(403).json({ error: "Access from your region is not allowed." });
    }

    // VPN/proxy detection (optional)
    if (VPN_DETECTION_ENABLED) {
      const vpnApiKey = process.env.IPQUALITYSCORE_API_KEY;
      if (vpnApiKey) {
        const vpnRes = await axios.get(
          `https://ipqualityscore.com/api/json/ip/${vpnApiKey}/${ip}`,
          { timeout: GEO_API_TIMEOUT }
        );
        const { vpn, proxy, tor } = vpnRes.data;
        console.log(`[VPN Check] VPN: ${vpn} | Proxy: ${proxy} | Tor: ${tor}`);
        if (vpn || proxy || tor) {
          return res.status(403).json({ error: "VPN/Proxy detected. Access denied." });
        }
      }
    }

    next();
  } catch (err) {
    console.error("Geo/VPN check failed:", err.message);
    if (GEO_BLOCKING_FALLBACK === "block") {
      return res.status(403).json({ error: "Geolocation check failed. Access denied." });
    }
    next();
  }
}

module.exports = geoVpnBlockMiddleware;
