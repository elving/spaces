import express from 'express'
import * as controller from '../controllers/suggestions'

const router = express.Router()

router.get('/suggestions', controller.renderSuggestions)

export default router
