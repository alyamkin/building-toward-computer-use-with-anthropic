import { useState } from 'react'
import { api } from '../../api/client'
import type { MessageSettings } from './useMessageSettings'

// Subset of the Anthropic Message object returned by the server
type MessageResponse = { content: { type: string; text?: string }[] }

export type ChatEntry = {
  id: string
  question: string
  answer?: string
  error?: string
  response?: MessageResponse
}

export function useChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [loading, setLoading] = useState(false)

  async function ask(question: string, { model, maxTokens }: MessageSettings) {
    const id = crypto.randomUUID()
    setEntries((prev) => [...prev, { id, question }])
    setLoading(true)
    try {
      const res = await api.post<MessageResponse>('/anthropic/messages', {
        content: question,
        model: model || undefined,
        maxTokens,
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

  return { entries, loading, ask }
}
