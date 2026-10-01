import type { RequestHandler } from 'express'
import * as anthropicService from '../services/anthropicService.js'
import { badRequest } from '../middleware/httpError.js'

export const postMessage: RequestHandler = async (req, res) => {
  const { content } = req.body as { content?: string }
  if (!content?.trim()) throw badRequest('content is required')
  res.json(await anthropicService.sendMessage(content))
}
