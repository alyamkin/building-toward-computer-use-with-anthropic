import type { useMessageSettings } from './useMessageSettings'

type Props = ReturnType<typeof useMessageSettings> & { onClose: () => void }

const fieldClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'

export function SettingsDrawer({
  models,
  model,
  setModel,
  maxTokensInput,
  setMaxTokensInput,
  maxTokensLimit,
  maxTokensError,
  onClose,
}: Props) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 border-r border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Message settings</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
        Model
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={models.length === 0}
          className={fieldClass}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} (${m.inputPrice} / ${m.outputPrice} per 1M)
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
        Max tokens
        <input
          type="number"
          min={1}
          max={maxTokensLimit}
          step={1}
          value={maxTokensInput}
          onChange={(e) => setMaxTokensInput(e.target.value)}
          aria-invalid={!!maxTokensError}
          className={`${fieldClass} ${maxTokensError ? 'border-red-500' : ''}`}
        />
        {maxTokensError && (
          <span role="alert" className="text-xs font-normal text-red-600">
            {maxTokensError}
          </span>
        )}
      </label>
    </aside>
  )
}
