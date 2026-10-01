import Anthropic from '@anthropic-ai/sdk'

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

export async function sendMessage(content: string) {
  const payload = createMessagePayload({ content, model: 'claude-haiku-4-5', maxTokens: 1024 })
  const message = await client.messages.create(payload)
  return message
}
