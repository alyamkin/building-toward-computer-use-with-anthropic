// Models selectable from the client, cheapest first. Prices are USD per 1M tokens.
// Newer models reject sampling params like `temperature` with a 400, hence `supportsTemperature`.
export const MODELS = [
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    inputPrice: 1,
    outputPrice: 5,
    supportsTemperature: true,
  },
  {
    id: 'claude-sonnet-5-5',
    name: 'Claude Sonnet 5.5',
    inputPrice: 2,
    outputPrice: 10,
    supportsTemperature: false,
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    inputPrice: 2,
    outputPrice: 10,
    supportsTemperature: false,
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    inputPrice: 3,
    outputPrice: 15,
    supportsTemperature: true,
  },
  {
    id: 'claude-opus-5-5',
    name: 'Claude Opus 5.5',
    inputPrice: 4,
    outputPrice: 20,
    supportsTemperature: false,
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    inputPrice: 5,
    outputPrice: 25,
    supportsTemperature: false,
  },
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    inputPrice: 5,
    outputPrice: 25,
    supportsTemperature: false,
  },
  {
    id: 'claude-fable-5-1',
    name: 'Claude Fable 5.1',
    inputPrice: 10,
    outputPrice: 50,
    supportsTemperature: false,
  },
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    inputPrice: 10,
    outputPrice: 50,
    supportsTemperature: false,
  },
] as const

export type ModelId = (typeof MODELS)[number]['id']

export const DEFAULT_MODEL: ModelId = 'claude-haiku-4-5'

export function isModelId(value: unknown): value is ModelId {
  return MODELS.some((m) => m.id === value)
}

export const DEFAULT_MAX_TOKENS = 1024

// The SDK rejects non-streaming requests that could run past 10 minutes (max_tokens > ~21,333)
export const MAX_TOKENS_LIMIT = 21_333

export function isValidMaxTokens(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= MAX_TOKENS_LIMIT
}

export const TEMPERATURE_LIMIT = { min: 0, max: 1 }

export function supportsTemperature(model: ModelId): boolean {
  return MODELS.find((m) => m.id === model)?.supportsTemperature ?? false
}

export function isValidTemperature(value: unknown): value is number {
  return (
    typeof value === 'number' && value >= TEMPERATURE_LIMIT.min && value <= TEMPERATURE_LIMIT.max
  )
}
