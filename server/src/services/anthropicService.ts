import Anthropic from '@anthropic-ai/sdk'
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  MAX_TOKENS_LIMIT,
  MODELS,
  TEMPERATURE_LIMIT,
  type ModelId,
} from '../config/models.js'

// Settings for a single message. `model` and `maxTokens` are required by the API, so they
// always have a value; add further settings as optional fields and only send them when set.
export interface MessageConfig {
  model: ModelId
  maxTokens: number
  stopSequences?: string[]
  temperature?: number
}

// What a caller may pass: every field is optional, required ones fall back to defaults
export type MessageConfigInput = Partial<MessageConfig>

const client = new Anthropic()

function resolveConfig({
  model = DEFAULT_MODEL,
  maxTokens = DEFAULT_MAX_TOKENS,
  ...optional
}: MessageConfigInput): MessageConfig {
  return { model, maxTokens, ...optional }
}

function createMessagePayload(
  content: string,
  { model, maxTokens, stopSequences, temperature }: MessageConfig,
): Anthropic.MessageCreateParamsNonStreaming {
  return {
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content }],
    ...(stopSequences?.length ? { stop_sequences: stopSequences } : {}),
    ...(temperature !== undefined ? { temperature } : {}),
  }
}

// Everything the client needs to build its message settings UI
export function getConfig() {
  return {
    models: MODELS,
    defaults: { model: DEFAULT_MODEL, maxTokens: DEFAULT_MAX_TOKENS },
    limits: { maxTokens: { min: 1, max: MAX_TOKENS_LIMIT }, temperature: TEMPERATURE_LIMIT },
  }
}

export async function sendMessage(content: string, config: MessageConfigInput = {}) {
  const payload = createMessagePayload(content, resolveConfig(config))
  const message = await client.messages.create(payload)
  return message
}
