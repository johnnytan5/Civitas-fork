import { Request, Response, NextFunction } from 'express'

/**
 * Wraps async route handlers to catch promise rejections
 * and pass them to Express error middleware
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
