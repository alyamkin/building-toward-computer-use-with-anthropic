type Props = { response?: unknown; onClose: () => void }

export function ResponseDrawer({ response, onClose }: Props) {
  return (
    <aside className="flex w-[40rem] max-w-[45vw] shrink-0 flex-col gap-4 border-l border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Response</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close response"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {response === undefined ? (
        <p className="text-sm text-gray-500">Send a message to see the raw API response.</p>
      ) : (
        <pre className="flex-1 overflow-auto rounded-lg bg-gray-900 p-3 font-mono text-xs leading-relaxed text-gray-100">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </aside>
  )
}
