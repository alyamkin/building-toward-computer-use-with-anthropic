import { useTodos } from './useTodos'

export function TodoList() {
  const { todos, error, loading } = useTodos()

  if (loading) return <p>Loading…</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>
          {t.done ? '✓' : '○'} {t.title}
        </li>
      ))}
    </ul>
  )
}
