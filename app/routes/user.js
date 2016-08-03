import express from 'express'
import * as controller from '../controllers/user'

const router = express.Router()
const ajaxRoot = '/ajax/designers'

router.get('/designers/', controller.renderIndex)
router.get('/designers/:username/', controller.redirectToProfileSpaces)
router.get('/designers/:username/likes/', controller.renderProfile)
router.get('/designers/:username/spaces/', controller.renderProfile)
router.get('/designers/:username/products/', controller.renderProfile)

export default router
