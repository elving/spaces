import express from 'express'
import * as controller from '../controllers/onboarding'

const router = express.Router()

router.get('/onboarding', controller.renderOnboarding)

export default router
