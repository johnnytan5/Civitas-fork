import { Router } from 'express'
import healthRouter from './health'
import contractsRouter from './contracts'

const router: Router = Router()

router.use('/health', healthRouter)
router.use('/api/contracts', contractsRouter)

export default router
