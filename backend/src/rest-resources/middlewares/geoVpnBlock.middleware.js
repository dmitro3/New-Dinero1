const axios = require("axios");

const GEO_BLOCKING_ENABLED = process.env.GEO_BLOCKING_ENABLED !== "false";
const VPN_DETECTION_ENABLED = process.env.VPN_DETECTION_ENABLED !== "false";
const GEO_BLOCKING_FALLBACK = process.env.GEO_BLOCKING_FALLBACK || "allow";
const GEO_API_TIMEOUT = parseInt(process.env.GEO_API_TIMEOUT) || 5000;

const blockedRegions = [
  { country: "US", state: "MI" }, // Michigan
  { country: "US", state: "ID" }, // Idaho
  { country: "US", state: "WA" }, // Washington
  { country: "US", state: "LA" }, // Louisiana
  { country: "US", state: "NV" }, // Nevada
  { country: "US", state: "MT" }, // Montana
  { country: "US", state: "CT" }, // Connecticut
  { country: "US", state: "HI" }, // Hawaii
  { country: "US", state: "DE" }, // Delaware
  { country: "US", state: "VA" }, // Virginia
  { country: "US", state: "OR" }, // Oregon
];
const blockedCountries = ["MX"];

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

    let { country_code2, state_prov, state_code, city } = geoRes.data;
    let normalizedStateCode = normalizeStateCode(state_code, state_prov);

    console.log(`[Geo] IP: ${ip} | Country: ${country_code2} | State: ${normalizedStateCode} | City: ${city}`);

    const inBlockedCountry = blockedCountries.includes(country_code2);
    const inBlockedState =
      country_code2 === "US" &&
      blockedRegions.some(r => r.state === normalizedStateCode);

    if (inBlockedCountry || inBlockedState) {
      console.warn(`❌ Blocked request from ${country_code2}-${normalizedStateCode || state_prov} (IP: ${ip})`);

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
            return res.status(403).json({ error: "VPN/Proxy detected from a restricted region. Access denied." });
          }
        }
      }
      return res.status(403).json({ error: "Access from your region is not allowed." });
    }

    next();
  } catch (err) {
    console.error("Geo/VPN check failed:", err.message);
    if (GEO_BLOCKING_FALLBACK === "block") {
      return res.status(403).json({ error: "Geolocation check failed. Access denied." });
    }
    console.warn("Geolocation check failed, allowing access as fallback");
    next();
  }
}

module.exports = geoVpnBlockMiddleware;
