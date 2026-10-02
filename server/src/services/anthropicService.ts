import Anthropic from '@anthropic-ai/sdk'
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  MAX_TOKENS_LIMIT,
  MODELS,
  type ModelId,
} from '../config/models.js'

interface MessagePayload {
  content: string
  model: string
  maxTokens: number
}

const client = new Anthropic()

function createMessagePayload({
  content,
  model,
  maxTokens,
}: MessagePayload): Anthropic.MessageCreateParamsNonStreaming {
  return {
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content }],
  }
}

// Everything the client needs to build its message settings UI
export function getConfig() {
  return {
    models: MODELS,
    defaults: { model: DEFAULT_MODEL, maxTokens: DEFAULT_MAX_TOKENS },
    limits: { maxTokens: { min: 1, max: MAX_TOKENS_LIMIT } },
  }
}

interface SendMessageOptions {
  model?: ModelId
  maxTokens?: number
}

export async function sendMessage(
  content: string,
  { model = DEFAULT_MODEL, maxTokens = DEFAULT_MAX_TOKENS }: SendMessageOptions = {},
) {
  const payload = createMessagePayload({ content, model, maxTokens })
  const message = await client.messages.create(payload)
  return message
}
