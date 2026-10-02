import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export type Model = {
  id: string
  name: string
  inputPrice: number
  outputPrice: number
  supportsTemperature: boolean
}

export type MessageSettings = {
  model: string
  maxTokens: number
  stopSequences: string[]
  temperature?: number
}

type ConfigResponse = {
  models: Model[]
  defaults: { model: string; maxTokens: number }
  limits: { maxTokens: { min: number; max: number }; temperature: { min: number; max: number } }
}

export function useMessageSettings() {
  const [models, setModels] = useState<Model[]>([])
  const [model, setModel] = useState('')
  // Kept as a string so the field can be cleared while typing
  const [maxTokensInput, setMaxTokensInput] = useState('1024')
  const [maxTokensLimit, setMaxTokensLimit] = useState(21_333)
  const [stopSequencesInput, setStopSequencesInput] = useState('')
  // Empty means "use the model's default"
  const [temperatureInput, setTemperatureInput] = useState('')
  const [temperatureLimit, setTemperatureLimit] = useState({ min: 0, max: 1 })

  useEffect(() => {
    api
      .get<ConfigResponse>('/anthropic/config')
      .then((config) => {
        setModels(config.models)
        setModel(config.defaults.model)
        setMaxTokensInput(String(config.defaults.maxTokens))
        setMaxTokensLimit(config.limits.maxTokens.max)
        setTemperatureLimit(config.limits.temperature)
      })
      .catch(() => {
        // Leave the list empty; the server falls back to its defaults
      })
  }, [])

  const maxTokens = Number(maxTokensInput)
  const maxTokensError =
    Number.isInteger(maxTokens) && maxTokens >= 1 && maxTokens <= maxTokensLimit
      ? undefined
      : `Enter a whole number from 1 to ${maxTokensLimit}`

  // Comma separated; surrounding whitespace and empty entries are dropped
  const stopSequences = stopSequencesInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const temperatureSupported = models.find((m) => m.id === model)?.supportsTemperature ?? false
  const temperatureSet = temperatureSupported && temperatureInput.trim() !== ''
  const temperature = temperatureSet ? Number(temperatureInput) : undefined
  const temperatureError =
    temperature === undefined ||
    (temperature >= temperatureLimit.min && temperature <= temperatureLimit.max)
      ? undefined
      : `Enter a number from ${temperatureLimit.min} to ${temperatureLimit.max}`

  const settings: MessageSettings = { model, maxTokens, stopSequences, temperature }

  return {
    models,
    model,
    setModel,
    maxTokensInput,
    setMaxTokensInput,
    maxTokensLimit,
    maxTokensError,
    stopSequencesInput,
    setStopSequencesInput,
    temperatureInput,
    setTemperatureInput,
    temperatureLimit,
    temperatureSupported,
    temperatureError,
    settings,
    isValid: !maxTokensError && !temperatureError,
  }
}
