import { Router } from 'express'
import * as c from '../controllers/anthropicController.js'

const router = Router()

router.get('/config', c.getConfig)
router.post('/messages', c.postMessage)
router.delete('/conversations/:id', c.deleteConversation)

export default router
