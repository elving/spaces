import express from 'express'
import * as controller from '../controllers/home'

const router = express.Router()

router.get('/', controller.renderHome)

export default router
