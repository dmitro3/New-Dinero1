import { Emitter } from '@socket.io/redis-emitter'
import { redisPublisher } from './redis'

const socketEmitter = new Emitter(redisPublisher)

export default socketEmitter
