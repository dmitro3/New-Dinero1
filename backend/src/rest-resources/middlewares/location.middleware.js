import config from '@src/configs/app.config'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import axios from 'axios'

import validator from 'validator'

const restrictedStates = ['US-MI', 'US-ID', 'US-WA', 'US-LA', 'US-NV', 'US-MT', 'US-CT', 'US-HI', 'US-DE']


export const getClientIp = (req) => {
  if (!req || !req.headers) return null // Prevent errors

  const ipHeaders = [
    'x-client-ip',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'x-forwarded-for',
    'forwarded-for',
    'forwarded',
    'x-appengine-user-ip',
    'Cf-Pseudo-IPv4'
  ]

  for (const header of ipHeaders) {
    if (req.headers[header] && validator.isIP(req.headers[header])) {
      return req.headers[header]
    }
  }

  // Handle x-forwarded-for (can contain multiple IPs)
  if (req.headers['x-forwarded-for']) {
    const xForwardedFor = req.headers['x-forwarded-for'].split(',')[0].trim()
    if (validator.isIP(xForwardedFor)) {
      return xForwardedFor
    }
  }

  // Check other request properties
  if (req.connection?.remoteAddress && validator.isIP(req.connection.remoteAddress)) {
    return req.connection.remoteAddress
  }

  if (req.socket?.remoteAddress && validator.isIP(req.socket.remoteAddress)) {
    return req.socket.remoteAddress
  }

  if (req.connection?.socket?.remoteAddress && validator.isIP(req.connection.socket.remoteAddress)) {
    return req.connection.socket.remoteAddress
  }

  if (req.info?.remoteAddress && validator.isIP(req.info.remoteAddress)) {
    return req.info.remoteAddress
  }

  if (req.requestContext?.identity?.sourceIp && validator.isIP(req.requestContext.identity.sourceIp)) {
    return req.requestContext.identity.sourceIp
  }

  return null
}

export function geoBlock () {
  return async function (req, res, next) {
    try {
      // console.log("request header",req.headers);

      const ip = await getClientIp(req)

      if (!ip) return next(new AppError(Errors.IP_NOT_FOUND))

      const geoApiBaseUrl = config.get('geoapi.url')
      const geoApiKey = config.get('geoapi.apikey')

      const geoApiUrl = `${geoApiBaseUrl}?apiKey=${geoApiKey}&ip=${ip}`
      const response = await axios.get(geoApiUrl)
      const state = response.data.state_code
      if (restrictedStates.includes(state)) {
        return next(new AppError(Errors.GEO_BLOCKED_LOCATION))
      }

      next()
    } catch (error) {
      console.error('Error fetching geolocation data:', error)
      next(new AppError(Errors.PERMISSION_DENIED))
    }
  }
}
