import config from '@src/configs/app.config'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import axios from 'axios'
import validator from 'validator'

/**
 * Allowed / Blocked Locations
 */
const allowedCountries = ["US", "IN"];
const blockedStates = ["MI", "ID", "WA", "LA", "NV", "MT", "CT", "HI", "DE"];
const blockedCountries = ["MX"];
const allowedIPs = ["50.158.74.231"];

/**
 * Extract client IP from request headers / connection
 */
export const getClientIp = (req) => {
  if (!req || !req.headers) return null;

  const ipHeaders = [
    "x-client-ip",
    "cf-connecting-ip",
    "fastly-client-ip",
    "true-client-ip",
    "x-real-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "x-forwarded-for",
    "forwarded-for",
    "forwarded",
    "x-appengine-user-ip",
    "cf-pseudo-ipv4", // lowercase fix
  ];

  // Loop through headers
  for (const header of ipHeaders) {
    const val = req.headers[header];
    if (val && validator.isIP(val)) return val;
  }

  // Handle x-forwarded-for (pick last public IP)
  if (req.headers["x-forwarded-for"]) {
    const ips = req.headers["x-forwarded-for"].split(",").map(ip => ip.trim());
    const publicIp = ips.reverse().find(ip => validator.isIP(ip) && !/^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(ip));
    if (publicIp) return publicIp;
  }

  // Check other request properties
  const candidates = [
    req.connection?.remoteAddress,
    req.socket?.remoteAddress,
    req.connection?.socket?.remoteAddress,
    req.info?.remoteAddress,
    req.requestContext?.identity?.sourceIp,
  ];

  for (const candidate of candidates) {
    if (candidate) {
      // Strip IPv6 prefix (::ffff:)
      const cleanIp = candidate.replace(/^::ffff:/, "");
      if (validator.isIP(cleanIp)) return cleanIp;
    }
  }

  return null;
};

/**
 * Middleware: Geo Location Blocking
 */
export function geoBlock() {
  return async function (req, res, next) {
    try {
      const ip = getClientIp(req);

      if (!ip) return next(new AppError(Errors.IP_NOT_FOUND));

      // Allow specific IPs to bypass geo blocking
      if (allowedIPs.includes(ip)) return next();

      const geoApiBaseUrl = config.get("geoapi.url");
      const geoApiKey = config.get("geoapi.apikey");

      const geoApiUrl = `${geoApiBaseUrl}?apiKey=${geoApiKey}&ip=${ip}`;
      const response = await axios.get(geoApiUrl);

      const state = response.data.state_code;
      const country = response.data.country_code2;

      // --- Rule 1: Block if country is not in allowlist
      if (!allowedCountries.includes(country)) {
        return next(new AppError(Errors.GEO_BLOCKED_LOCATION));
      }

      // --- Rule 2: Explicitly block restricted countries (e.g., Mexico)
      if (blockedCountries.includes(country)) {
        return next(new AppError(Errors.GEO_BLOCKED_LOCATION));
      }

      // --- Rule 3: Block restricted US states
      if (country === "US" && blockedStates.includes(state)) {
        return next(new AppError(Errors.GEO_BLOCKED_LOCATION));
      }

      // ✅ Allowed
      next();
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
      next(new AppError(Errors.PERMISSION_DENIED));
    }
  };
}
