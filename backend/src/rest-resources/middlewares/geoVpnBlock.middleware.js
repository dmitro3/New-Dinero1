const axios = require("axios");
const config = require("../../configs/app.config");

const GEO_BLOCKING_ENABLED = process.env.GEO_BLOCKING_ENABLED;
const VPN_DETECTION_ENABLED = process.env.VPN_DETECTION_ENABLED;
const GEO_BLOCKING_FALLBACK = process.env.GEO_BLOCKING_FALLBACK;
const GEO_API_TIMEOUT = parseInt(process.env.GEO_API_TIMEOUT);

// Blocked U.S. states
const blockedStates = ["MI", "ID", "WA", "LA", "NV", "MT", "CT", "HI", "DE"];

// Countries that are allowed
const allowedCountries = ["US", "IN"];

const allowedIPs = ["50.158.74.231"];

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
  if (!allowedCountries.includes(country)) return true;

  if (country === "IN") return false;

  if (country === "US" && blockedStates.includes(stateCode)) {
    return true;
  }

  return false;
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
    // Allow specific IPs to bypass geo blocking
    if (allowedIPs.includes(ip)) return next();

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
    if (VPN_DETECTION_ENABLED) {
      const vpnApiKey = process.env.IPQUALITYSCORE_API_KEY;
      if (vpnApiKey) {
      const geoRes = await axios.get(
      `${config.get('geoapi.url')}?apiKey=${geoApiKey}&ip=${ip}`,
      { timeout: GEO_API_TIMEOUT }
    );
       { console.log("vpn res : ", vpnRes.data);}
        const { vpn, fraud_score } = vpnRes.data;
        if (vpn && fraud_score > 90) {
          return res.status(403).json({
            error: "Access Denied, VPN is detected",
          });
        }
      }
    }


    next();
  } catch (err) {
  console.error("Geo/VPN check failed:", err.response?.data || err.message);

  if (GEO_BLOCKING_FALLBACK === "block") {
    return res.status(403).json({ error: "Geolocation check failed. Access denied." });
  }

  // Fallback: allow access
  next();
}

}

module.exports = geoVpnBlockMiddleware;
