import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export type Todo = { id: string; title: string; done: boolean }

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .get<Todo[]>('/todos')
      .then((data) => active && setTodos(data))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false // don't set state after unmount
    }
  }, [])

  return { todos, error, loading }
}
