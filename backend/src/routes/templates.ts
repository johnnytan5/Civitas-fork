import { Router, Request, Response } from 'express'
import { asyncHandler } from '@/utils/asyncHandler'
import { NotFoundError } from '@/utils/errors'
import { getAllTemplates, getTemplate } from '@/config/templates'

const router: Router = Router()

/**
 * GET /api/templates
 * List all available contract templates
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const templates = getAllTemplates().map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    params: t.params,
    roles: t.roles,
  }))

  res.json({ templates })
}))

/**
 * GET /api/templates/:id
 * Get a single template with full details including ABI
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const template = getTemplate(req.params.id as string)

  if (!template) {
    throw new NotFoundError(`Template not found: ${req.params.id}`)
  }

  res.json({
    id: template.id,
    name: template.name,
    description: template.description,
    params: template.params,
    roles: template.roles,
    stateFields: template.stateFields,
    factoryFunctionName: template.factoryFunctionName,
    abi: template.abi,
  })
}))

export default router
