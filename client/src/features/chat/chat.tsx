import { useState, type FormEvent } from 'react'
import { useChat } from './useChat'
import { useMessageSettings } from './useMessageSettings'
import { SettingsDrawer } from './settingsDrawer'
import { ResponseDrawer } from './responseDrawer'
import { CodeBracketIcon, GearIcon } from './icons'

const answerClass =
  'w-fit max-w-[80%] rounded-lg bg-white px-4 py-2 whitespace-pre-wrap text-gray-900 shadow-sm'

export function Chat() {
  const { entries, loading, ask, newChat } = useChat()
  const messageSettings = useMessageSettings()
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [responseOpen, setResponseOpen] = useState(true)
  // null = follow the latest response
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [input, setInput] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading || !messageSettings.isValid) return
    setInput('')
    setSelectedId(null)
    void ask(question, messageSettings.settings)
  }

  const viewed = selectedId
    ? entries.find((e) => e.id === selectedId)
    : entries.findLast((e) => e.response)

  return (
    <div className="flex h-screen">
      {settingsOpen && (
        <SettingsDrawer {...messageSettings} onClose={() => setSettingsOpen(false)} />
      )}

      <main className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col p-4">
        <header className="mb-4 flex items-center gap-3">
          {!settingsOpen && (
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
              className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-100"
            >
              <GearIcon className="size-5" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">Ask Claude</h1>
          <button
            type="button"
            onClick={() => {
              newChat()
              setSelectedId(null)
            }}
            disabled={loading || entries.length === 0}
            className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            New chat
          </button>
          {!responseOpen && (
            <button
              type="button"
              onClick={() => setResponseOpen(true)}
              aria-label="Open response"
              className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-100"
            >
              <CodeBracketIcon className="size-5" />
            </button>
          )}
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
          {entries.length === 0 && <p className="text-gray-500">Ask a question to get started.</p>}
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-2">
              <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-blue-600 px-4 py-2 text-white">
                {entry.question}
              </div>
              {entry.response ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(entry.id)
                    setResponseOpen(true)
                  }}
                  title="Show raw response"
                  className={`${answerClass} block text-left ${
                    viewed?.id === entry.id
                      ? 'ring-2 ring-blue-300'
                      : 'hover:ring-2 hover:ring-gray-200'
                  }`}
                >
                  {entry.answer}
                </button>
              ) : (
                <div className={answerClass}>
                  {entry.error ? (
                    <span role="alert" className="text-red-600">
                      {entry.error}
                    </span>
                  ) : (
                    <span className="animate-pulse text-gray-400">Thinking…</span>
                  )}
                </div>
              )}
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
            disabled={loading || !input.trim() || !messageSettings.isValid}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </form>
      </main>

      {responseOpen && (
        <ResponseDrawer response={viewed?.response} onClose={() => setResponseOpen(false)} />
      )}
    </div>
  )
}
