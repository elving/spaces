import express from 'express'
import * as controller from '../controllers/user'

const router = express.Router()
const ajaxRoot = '/ajax/designers'

router.get('/designers/', controller.renderIndex)
router.get('/designers/:username/', controller.redirectToProfileSpaces)
router.get('/designers/:username/edit', controller.renderProfileForm)
router.get('/designers/:username/likes/', controller.renderProfile)
router.get('/designers/:username/spaces/', controller.renderProfile)
router.get('/designers/:username/products/', controller.renderProfile)
router.get('/designers/:username/password/', controller.showPassword)
router.get('/designers/:username/followers/', controller.renderProfile)
router.get('/designers/:username/following/', controller.renderProfile)

router.get(`${ajaxRoot}/:id/likes/`, controller.getUserLikes)
router.get(`${ajaxRoot}/:id/following/`, controller.getUserFollows)
router.put(`${ajaxRoot}/:id/`, controller.updateUser)
router.put(`${ajaxRoot}/:id/password/`, controller.changePassword)

export default router
