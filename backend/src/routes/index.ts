import { Router } from 'express'
import healthRouter from './health'
import contractsRouter from './contracts'
import templatesRouter from './templates'

const router: Router = Router()

router.use('/health', healthRouter)
router.use('/api/contracts', contractsRouter)
router.use('/api/templates', templatesRouter)

export default router
