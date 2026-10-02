import type { RequestHandler } from 'express'
import * as anthropicService from '../services/anthropicService.js'
import { badRequest } from '../middleware/httpError.js'
import { MAX_TOKENS_LIMIT, isModelId, isValidMaxTokens } from '../config/models.js'

export const getConfig: RequestHandler = (_req, res) => {
  res.json(anthropicService.getConfig())
}

export const postMessage: RequestHandler = async (req, res) => {
  const { content, model, maxTokens } = req.body as {
    content?: string
    model?: string
    maxTokens?: unknown
  }
  if (!content?.trim()) throw badRequest('content is required')
  if (model !== undefined && !isModelId(model)) throw badRequest(`unsupported model: ${model}`)
  if (maxTokens !== undefined && !isValidMaxTokens(maxTokens)) {
    throw badRequest(`maxTokens must be an integer between 1 and ${MAX_TOKENS_LIMIT}`)
  }
  res.json(await anthropicService.sendMessage(content, { model, maxTokens }))
}
