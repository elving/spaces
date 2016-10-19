import express from 'express'
import * as controller from '../controllers/page'

const router = express.Router()

router.get('/', controller.renderLanding)
router.get('/about/', controller.renderAbout)
router.get('/terms/', controller.renderTerms)
router.get('/privacy/', controller.renderPrivacy)
router.get('/copyright/', controller.renderCopyright)

export default router
