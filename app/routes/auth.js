import express from 'express'
import passport from 'passport'

import isLoggedIn from '../utils/middlewares/isLoggedIn'
import * as controller from '../controllers/auth'

const router = express.Router()

router.get('/join/', controller.renderJoin)
router.get('/signup/', controller.redirectToJoin)
router.get('/register/', controller.redirectToJoin)
router.get('/login/', controller.renderLogin)
router.get('/signin/', controller.redirectToLogin)
router.get('/logout/', isLoggedIn, controller.logout)
router.get('/reset-password/', controller.renderResetPassword)
router.get('/set-password/:code/', controller.renderSetPassword)

router.get('/auth/facebook/', passport.authenticate('facebook', {
  scope: ['email'],
  failureRedirect: '/login'
}))

router.get('/auth/facebook/callback/', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), controller.authCallback)

router.get('/auth/twitter/', passport.authenticate('twitter', {
  failureRedirect: '/login'
}))

router.get('/auth/twitter/callback/', passport.authenticate('twitter', {
  failureRedirect: '/login'
}), controller.authCallback)

router.post('/ajax/join/', controller.join)
router.post('/ajax/login/', controller.login)
router.post('/ajax/reset-password/', controller.requestPasswordReset)
router.post('/ajax/set-password/:code/', controller.setPassword)

export default router
