import { Router } from 'express'
import * as c from '../controllers/todoController.js'

const router = Router()

router.get('/', c.getTodos)
router.post('/', c.postTodo)
router.delete('/:id', c.deleteTodo)

export default router
