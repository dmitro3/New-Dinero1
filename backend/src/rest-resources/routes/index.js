import healthCheck from '@src/libs/healthCheck'
import express from 'express'
import apiRoutes from './api'

const router = express.Router()

const NAMESPACE = '/api'
router.use(`${NAMESPACE}`, apiRoutes)
router.get('/healthcheck', async (_, res) => {
  try {
    const response = await healthCheck()
    res.json(response)
  } catch (error) {
    res.status(503)
    res.send()
  }
})

export default router
