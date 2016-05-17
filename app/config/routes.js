import getVersion from '../utils/getVersion'
import isAuthenticatedUser from '../utils/isAuthenticatedUser'

import { default as authRouter } from '../routes/auth'
import { default as colorRouter } from '../routes/color'
import { default as brandRouter } from '../routes/brand'
import { default as searchRouter } from '../routes/search'
import { default as productRouter } from '../routes/product'
import { default as categoryRouter } from '../routes/category'
import { default as spaceTypeRouter } from '../routes/spaceType'

const configRoutes = (server) => {
  server.use(authRouter)
  server.use(colorRouter)
  server.use(brandRouter)
  server.use(searchRouter)
  server.use(productRouter)
  server.use(categoryRouter)
  server.use(spaceTypeRouter)

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
