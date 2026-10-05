import type Anthropic from '@anthropic-ai/sdk'

type Turn = Anthropic.MessageParam

// In-memory history per conversation, keyed by an id the client generates; lost on restart
const conversations = new Map<string, Turn[]>()

export function getHistory(id: string): readonly Turn[] {
  return conversations.get(id) ?? []
}

export function appendTurns(id: string, ...turns: Turn[]) {
  conversations.set(id, [...getHistory(id), ...turns])
}

export function clearHistory(id: string) {
  conversations.delete(id)
}
