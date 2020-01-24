import express from 'express'
import * as controller from '../controllers/feed'

const router = express.Router()

router.get('/feed', controller.renderFeed)

export default router
