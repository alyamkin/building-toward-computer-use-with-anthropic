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

// Validates the images the client sent; the service turns them into image content blocks
function parseImages(raw: unknown): anthropicService.ImageInput[] {
  if (raw === undefined) return []
  if (!Array.isArray(raw)) throw badRequest('images must be an array')
  return raw.map((image: unknown, i) => {
    if (typeof image !== 'object' || image === null) {
      throw badRequest(`images[${i}] must be an object`)
    }
    const { mediaType, data } = image as Record<string, unknown>
    if (!anthropicService.isImageMediaType(mediaType)) {
      throw badRequest(
        `images[${i}].mediaType must be one of ${anthropicService.IMAGE_MEDIA_TYPES.join(', ')}`,
      )
    }
    if (typeof data !== 'string' || !data) {
      throw badRequest(`images[${i}].data must be a non-empty base64 string`)
    }
    return { mediaType, data }
  })
}

function parseConversationId(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.trim()) throw badRequest('conversationId is required')
  return raw
}

export const postMessage: RequestHandler = async (req, res) => {
  const { conversationId, text, images, config } = req.body as {
    conversationId?: unknown
    text?: string
    images?: unknown
    config?: unknown
  }
  const id = parseConversationId(conversationId)
  if (!text?.trim()) throw badRequest('text is required')
  res.json(
    await anthropicService.sendMessage(id, text, parseImages(images), parseMessageConfig(config)),
  )
}

export const deleteConversation: RequestHandler<{ id: string }> = (req, res) => {
  anthropicService.resetConversation(req.params.id)
  res.status(204).end()
}
