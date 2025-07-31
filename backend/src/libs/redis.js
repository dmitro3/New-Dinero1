// Temporary mock Redis to avoid connection errors
class MockRedis {
  constructor() {
    this.store = new Map()
    this.subscribers = new Map()
  }
  
  async ping() {
    return 'PONG'
  }
  
  async get(key) {
    return this.store.get(key) || null
  }
  
  async set(key, value, ttl = null) {
    this.store.set(key, value)
    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl * 1000)
    }
    return 'OK'
  }
  
  async del(key) {
    return this.store.delete(key) ? 1 : 0
  }
  
  async quit() {
    return 'OK'
  }
  
  duplicate() {
    return new MockRedis()
  }

  // Socket.IO Redis adapter methods
  async psubscribe(pattern) {
    return 'OK'
  }

  async subscribe(channel) {
    return 'OK'
  }

  async unsubscribe(channel) {
    return 'OK'
  }

  async punsubscribe(pattern) {
    return 'OK'
  }

  async publish(channel, message) {
    return 1
  }

  // Event emitter methods for Socket.IO
  on(event, callback) {
    // Mock event handling
    return this
  }

  off(event, callback) {
    return this
  }

  emit(event, data) {
    // Mock event emission
    return true
  }
}

// Initialize mock Redis connections
export const client = new MockRedis()
export const redisPublisher = new MockRedis()
export const redisSubscriber = new MockRedis()

// Cache functions
export const getCache = async (key) => {
  return await client.get(key)
}

export const setCache = async (key, value, expirationInSeconds = null) => {
  return await client.set(key, value, expirationInSeconds)
}

export const deleteCache = async (key) => {
  return await client.del(key)
}

/**
 * Gracefully closes all Redis connections.
 */
export const closeConnections = async () => {
  try {
    await Promise.all([
      client.quit(),
      redisPublisher.quit(),
      redisSubscriber.quit(),
    ])
  } catch (error) {
    console.error('Error closing Redis connections:', error)
  }
}
