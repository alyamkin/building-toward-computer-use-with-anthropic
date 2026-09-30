import type { RequestHandler } from 'express'
import * as todoService from '../services/todoService.js'

export const getTodos: RequestHandler = (_req, res) => {
  res.json(todoService.listTodos())
}

export const postTodo: RequestHandler = (req, res) => {
  const { title } = req.body as { title?: string }
  res.status(201).json(todoService.createTodo(title ?? ''))
}

export const deleteTodo: RequestHandler<{ id: string }> = (req, res) => {
  todoService.removeTodo(req.params.id)
  res.status(204).end()
}
