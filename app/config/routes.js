import logError from '../utils/logError'
import getVersion from '../utils/getVersion'
import isJoinRoute from '../utils/isJoinRoute'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import authRouter from '../routes/auth'
import ajaxRouter from '../routes/ajax'
import pageRouter from '../routes/page'
import homeRouter from '../routes/home'
import feedRouter from '../routes/feed'
import userRouter from '../routes/user'
import likeRouter from '../routes/like'
import guideRouter from '../routes/guide'
import colorRouter from '../routes/color'
import brandRouter from '../routes/brand'
import spaceRouter from '../routes/space'
import followRouter from '../routes/follow'
import searchRouter from '../routes/search'
import commentRouter from '../routes/comment'
import productRouter from '../routes/product'
import categoryRouter from '../routes/category'
import spaceTypeRouter from '../routes/spaceType'
import onboardingRouter from '../routes/onboarding'
import suggestionsRouter from '../routes/suggestions'
import notificationRouter from '../routes/notification'

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
  server.use(guideRouter)
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
  server.use(notificationRouter)

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
