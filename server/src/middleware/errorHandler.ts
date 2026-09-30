import type { ErrorRequestHandler, RequestHandler } from 'express'
import { HttpError } from './httpError.js'
import { env } from '../config/env.js'

// Runs when no route matched. Turns a 404 into a normal error.
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `No route for ${req.method} ${req.originalUrl}`))
}

// MUST take exactly four arguments — that signature is how
// Express recognises it as an error handler.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500

  if (status >= 500) console.error(err)

  res.status(status).json({
    message:
      status >= 500 && env.isProduction
        ? 'Internal Server Error' // never leak internals to clients
        : err instanceof Error
          ? err.message
          : 'Unknown error',
  })
}
