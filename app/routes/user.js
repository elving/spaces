import express from 'express'

import isLoggedIn from '../utils/middlewares/isLoggedIn'
import * as controller from '../controllers/user'

const router = express.Router()
const ajaxRoot = '/ajax/users'

router.get('/users/', controller.renderIndex)
router.get('/community/', controller.renderIndex)
router.get('/friends/', isLoggedIn, controller.renderFriends)
router.get('/users/:username/', controller.redirectToProfileSpaces)
router.get('/u/:username/', controller.redirectToProfileSpaces)
router.get('/users/:username/edit', controller.renderProfileForm)
router.get('/u/:username/edit', controller.renderProfileForm)
router.get('/users/:username/likes/', controller.renderProfile)
router.get('/u/:username/likes/', controller.renderProfile)
router.get('/users/:username/spaces/', controller.renderProfile)
router.get('/u/:username/spaces/', controller.renderProfile)
router.get('/users/:username/products/', controller.renderProfile)
router.get('/u/:username/products/', controller.renderProfile)
router.get('/users/:username/password/', controller.showPassword)
router.get('/u/:username/password/', controller.showPassword)
router.get('/users/:username/followers/', controller.renderProfile)
router.get('/u/:username/followers/', controller.renderProfile)
router.get('/users/:username/following/', controller.renderProfile)
router.get('/u/:username/following/', controller.renderProfile)
router.get('/users/:username/recommended', controller.renderRecommended)
router.get('/u/:username/recommended', controller.renderRecommended)

router.get(`${ajaxRoot}/:id/likes/`, controller.getUserLikes)
router.get(`${ajaxRoot}/:id/following/`, controller.getUserFollows)
router.put(`${ajaxRoot}/:id/`, controller.updateUser)
router.put(`${ajaxRoot}/:id/password/`, controller.changePassword)

export default router
