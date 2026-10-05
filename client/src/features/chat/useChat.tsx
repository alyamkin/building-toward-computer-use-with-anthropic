import { useState } from 'react'
import { api } from '../../api/client'
import type { MessageSettings } from './useMessageSettings'
import type { ImageInput } from './images'

// Subset of the Anthropic Message object returned by the server
type MessageResponse = { content: { type: string; text?: string }[] }

export type ChatEntry = {
  id: string
  question: string
  images: ImageInput[]
  answer?: string
  error?: string
  response?: MessageResponse
}

export function useChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [loading, setLoading] = useState(false)
  // The server keeps the history for this id and sends it with every request
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID())

  async function ask(
    question: string,
    images: ImageInput[],
    { model, maxTokens, stopSequences, temperature }: MessageSettings,
  ) {
    const id = crypto.randomUUID()
    setEntries((prev) => [...prev, { id, question, images }])
    setLoading(true)
    try {
      const res = await api.post<MessageResponse>('/anthropic/messages', {
        conversationId,
        text: question,
        images: images.length ? images : undefined,
        // Optional; the server fills in defaults for anything left out
        config: {
          model: model || undefined,
          maxTokens,
          stopSequences: stopSequences.length ? stopSequences : undefined,
          temperature,
        },
      })
      const answer = res.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, answer, response: res } : e)))
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : 'Failed'
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, error } : e)))
    } finally {
      setLoading(false)
    }
  }

  function newChat() {
    // Best effort: the server only holds the history in memory anyway
    api.delete(`/anthropic/conversations/${conversationId}`).catch(() => {})
    setConversationId(crypto.randomUUID())
    setEntries([])
  }

  return { entries, loading, ask, newChat }
}
