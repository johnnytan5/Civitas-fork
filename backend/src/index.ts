import express from 'express'
import cors from 'cors'
import { env } from './config/environment'
import { startCronJobs } from './services/cron/scheduler'
import { startEventListeners } from './listeners/setup'
import { logger } from './utils/logger'
import { AppError } from './utils/errors'
import routes from './routes'

const app = express()

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use(routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  })
})

// Error handling middleware (MUST be last)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Check if it's an operational error
  const isOperationalError = err instanceof AppError && err.isOperational
  const statusCode = err instanceof AppError ? err.statusCode : 500

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    isOperationalError,
  })

  res.status(statusCode).json({
    error: isOperationalError ? err.message : 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Start server
const server = app.listen(env.PORT, () => {
  logger.info(`Server running`, {
    port: env.PORT,
    environment: env.NODE_ENV,
  })

  // Start background services AFTER server is listening
  try {
    startCronJobs()
    startEventListeners()
    logger.info('All services initialized successfully')
  } catch (error) {
    logger.error('Failed to start background services', { error })
    process.exit(1) // Exit if critical services fail
  }
})

// Graceful shutdown handling
const shutdown = () => {
  logger.info('Shutdown signal received, closing server gracefully...')

  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
