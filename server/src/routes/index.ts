import { Router } from 'express'
import todos from './todos.js'
import anthropic from './anthropic.js'

const router = Router()

router.use('/todos', todos)
router.use('/anthropic', anthropic)

export default router
