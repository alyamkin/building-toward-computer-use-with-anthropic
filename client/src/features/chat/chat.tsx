import { useState, type FormEvent } from 'react'
import { useChat } from './useChat'

export function Chat() {
  const { entries, loading, ask } = useChat()
  const [input, setInput] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return
    setInput('')
    void ask(question)
  }

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col p-4">
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Ask Claude</h1>

      <section className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        {entries.length === 0 && <p className="text-gray-500">Ask a question to get started.</p>}
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-blue-600 px-4 py-2 text-white">
              {entry.question}
            </div>
            <div className="w-fit max-w-[80%] rounded-lg bg-white px-4 py-2 whitespace-pre-wrap text-gray-900 shadow-sm">
              {entry.error ? (
                <span role="alert" className="text-red-600">
                  {entry.error}
                </span>
              ) : (
                (entry.answer ?? <span className="animate-pulse text-gray-400">Thinking…</span>)
              )}
            </div>
          </div>
        ))}
      </section>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
