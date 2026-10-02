import type { RequestHandler } from 'express'
import * as anthropicService from '../services/anthropicService.js'
import { badRequest } from '../middleware/httpError.js'
import {
  DEFAULT_MODEL,
  MAX_TOKENS_LIMIT,
  TEMPERATURE_LIMIT,
  isModelId,
  isValidMaxTokens,
  isValidTemperature,
  supportsTemperature,
} from '../config/models.js'

export const getConfig: RequestHandler = (_req, res) => {
  res.json(anthropicService.getConfig())
}

// The API rejects stop sequences that are empty or whitespace-only
function isValidStopSequences(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((s) => typeof s === 'string' && s.trim() !== '')
}

// Validates whatever the client sent; anything missing is filled in by the service
function parseMessageConfig(raw: unknown): anthropicService.MessageConfigInput {
  if (raw === undefined) return {}
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw badRequest('config must be an object')
  }
  const { model, maxTokens, stopSequences, temperature } = raw as Record<string, unknown>
  if (model !== undefined && !isModelId(model)) throw badRequest(`unsupported model: ${model}`)
  if (maxTokens !== undefined && !isValidMaxTokens(maxTokens)) {
    throw badRequest(`maxTokens must be an integer between 1 and ${MAX_TOKENS_LIMIT}`)
  }
  if (stopSequences !== undefined && !isValidStopSequences(stopSequences)) {
    throw badRequest('stopSequences must be an array of strings with non-whitespace characters')
  }
  if (temperature !== undefined) {
    if (!isValidTemperature(temperature)) {
      throw badRequest(
        `temperature must be a number between ${TEMPERATURE_LIMIT.min} and ${TEMPERATURE_LIMIT.max}`,
      )
    }
    if (!supportsTemperature(model ?? DEFAULT_MODEL)) {
      throw badRequest(`temperature is not supported by ${model ?? DEFAULT_MODEL}`)
    }
  }
  return { model, maxTokens, stopSequences, temperature }
}

export const postMessage: RequestHandler = async (req, res) => {
  const { content, config } = req.body as { content?: string; config?: unknown }
  if (!content?.trim()) throw badRequest('content is required')
  res.json(await anthropicService.sendMessage(content, parseMessageConfig(config)))
}
