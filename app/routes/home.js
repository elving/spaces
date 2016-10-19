import express from 'express'
import * as controller from '../controllers/home'

const router = express.Router()

router.get('/popular/', controller.renderHome)

export default router
