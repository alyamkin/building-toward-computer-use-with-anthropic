import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export type Model = { id: string; name: string; inputPrice: number; outputPrice: number }

export type MessageSettings = { model: string; maxTokens: number }

type ConfigResponse = {
  models: Model[]
  defaults: { model: string; maxTokens: number }
  limits: { maxTokens: { min: number; max: number } }
}

export function useMessageSettings() {
  const [models, setModels] = useState<Model[]>([])
  const [model, setModel] = useState('')
  // Kept as a string so the field can be cleared while typing
  const [maxTokensInput, setMaxTokensInput] = useState('1024')
  const [maxTokensLimit, setMaxTokensLimit] = useState(21_333)

  useEffect(() => {
    api
      .get<ConfigResponse>('/anthropic/config')
      .then((config) => {
        setModels(config.models)
        setModel(config.defaults.model)
        setMaxTokensInput(String(config.defaults.maxTokens))
        setMaxTokensLimit(config.limits.maxTokens.max)
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

  const settings: MessageSettings = { model, maxTokens }

  return {
    models,
    model,
    setModel,
    maxTokensInput,
    setMaxTokensInput,
    maxTokensLimit,
    maxTokensError,
    settings,
    isValid: !maxTokensError,
  }
}
