import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '@src/configs/app.config'
import i18n from '@src/libs/i18n'
import routes from '@src/rest-resources/routes'
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware'

const app = express()

app.use(helmet())

// app.use(bodyParser.json())
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Save raw body as string
    },
  })
)

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use(i18n.init)

// CORS Configuration - Allow all origins for development
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for development
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))


app.use(routes)

app.use(async (req, res) => {
  res.status(404).json({ message: 'Welcome to player backend' })
})

app.use(errorHandlerMiddleware)

export default app
