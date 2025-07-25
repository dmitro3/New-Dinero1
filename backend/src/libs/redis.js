import config from '@src/configs/app.config'
import Redis from 'ioredis'

const connectionOptions = {
  host: config.get('redis.host'),
  port: config.get('redis.port'),
  password: config.get('redis.password')
}

// Initialize Redis connections
export const client = new Redis(connectionOptions)
export const redisPublisher = new Redis(connectionOptions)
export const redisSubscriber = redisPublisher.duplicate()

/**
 * Retrieves a value from the cache.
 * @param {string} key - The cache key.
 * @returns {Promise<string|null>} Resolves to the cached value for the given key, or null if not found.
 */
export const getCache = async (key) => {
  return await client.get(key)
}

/**
 * Removes a value from the cache.
 * @param {string} key - The cache key to be removed.
 * @returns {Promise<void>}
 */
export const deleteCache = async (key) => {
  await client.del(key)
}

/**
 * Sets a value in the cache with an expiration time.
 * @param {string} key - The cache key.
 * @param {string} value - The value to cache.
 * @param {number} expirationInSeconds - Expiration time in seconds (defaults to 86400 seconds, or 24 hours).
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, expirationInSeconds = null) => {
  await client.set(key, value, 'EX', expirationInSeconds, 'NX')
}

/**
 * Gracefully closes all Redis connections.
 * @returns {Promise<void>}
 */
export const closeConnections = async () => {
  await Promise.all([
    redisPublisher.quit(),
    redisSubscriber.quit(),
    client.quit()
  ])
}
