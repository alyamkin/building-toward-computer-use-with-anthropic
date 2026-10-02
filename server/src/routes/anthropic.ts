import { Router } from 'express'
import * as c from '../controllers/anthropicController.js'

const router = Router()

router.get('/config', c.getConfig)
router.post('/messages', c.postMessage)

export default router
