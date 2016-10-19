import logError from '../utils/logError'
import getVersion from '../utils/getVersion'
import isJoinRoute from '../utils/isJoinRoute'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import { default as authRouter } from '../routes/auth'
import { default as ajaxRouter } from '../routes/ajax'
import { default as pageRouter } from '../routes/page'
import { default as homeRouter } from '../routes/home'
import { default as feedRouter } from '../routes/feed'
import { default as userRouter } from '../routes/user'
import { default as likeRouter } from '../routes/like'
import { default as colorRouter } from '../routes/color'
import { default as brandRouter } from '../routes/brand'
import { default as spaceRouter } from '../routes/space'
import { default as followRouter } from '../routes/follow'
import { default as searchRouter } from '../routes/search'
import { default as commentRouter } from '../routes/comment'
import { default as productRouter } from '../routes/product'
import { default as categoryRouter } from '../routes/category'
import { default as spaceTypeRouter } from '../routes/spaceType'
import { default as onboardingRouter } from '../routes/onboarding'
import { default as suggestionsRouter } from '../routes/suggestions'

const configRoutes = (server) => {
  server.use((req, res, next) => {
    const isLoggedOut = !isAuthenticatedUser(req.user)

    if (isLoggedOut && !isJoinRoute(req.url) && req.url !== '/') {
      return res.redirect('/')
    }

    next()
  })

  server.use(ajaxRouter)
  server.use(authRouter)
  server.use(pageRouter)
  server.use(homeRouter)
  server.use(feedRouter)
  server.use(userRouter)
  server.use(likeRouter)
  server.use(colorRouter)
  server.use(brandRouter)
  server.use(spaceRouter)
  server.use(followRouter)
  server.use(searchRouter)
  server.use(commentRouter)
  server.use(productRouter)
  server.use(categoryRouter)
  server.use(spaceTypeRouter)
  server.use(onboardingRouter)
  server.use(suggestionsRouter)

  // Misc
  server.get('/400/', (req, res) => {
    res.render('404', {
      err: null,
      env: process.env.NODE_ENV || 'development',
      hasUrl: false,
      isAdmin: isAuthenticatedUser(req.user) ? req.user.isAdmin : false,
      version: getVersion(),
      reactProps: {}
    })
  })

  server.get('/500/', (req, res) => {
    res.render('500', {
      err: null,
      env: process.env.NODE_ENV || 'development',
      hasUrl: false,
      isAdmin: isAuthenticatedUser(req.user) ? req.user.isAdmin : false,
      version: getVersion(),
      reactProps: {}
    })
  })

  server.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      logError(err)
    }

    res.render('500', {
      err,
      env: process.env.NODE_ENV || 'development',
      hasUrl: true,
      isAdmin: isAuthenticatedUser(req.user) ? req.user.isAdmin : false,
      version: getVersion(),
      reactProps: {}
    })
  })
}

export default configRoutes
