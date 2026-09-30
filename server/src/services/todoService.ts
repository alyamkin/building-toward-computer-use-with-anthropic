import { HttpError } from '../middleware/httpError.js'

export type Todo = { id: string; title: string; done: boolean }

// In-memory for now. Swap for a real database later — callers don't change.
const todos: Todo[] = [{ id: '1', title: 'Understand project structure', done: true }]

export function listTodos(): Todo[] {
  return todos
}

export function createTodo(title: string): Todo {
  if (!title?.trim()) throw new HttpError(400, 'title is required')
  const todo: Todo = { id: crypto.randomUUID(), title: title.trim(), done: false }
  todos.push(todo)
  return todo
}

export function removeTodo(id: string): void {
  const i = todos.findIndex((t) => t.id === id)
  if (i === -1) throw new HttpError(404, `No todo with id ${id}`)
  todos.splice(i, 1)
}
