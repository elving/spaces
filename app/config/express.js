import path from 'path'
import csrf from 'csurf'
import multer from 'multer'
import morgan from 'morgan'
import express from 'express'
import webpack from 'webpack'
import session from 'express-session'
import passport from 'passport'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import methodOverride from 'method-override'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import { default as connectMongo } from 'connect-mongo'

import render from '../utils/middlewares/render'
import configRoutes from './routes'
import webpackConfig from '../../webpack.config.dev'

const MongoStore = connectMongo(session)
const isInDevelopment = process.env.NODE_ENV === 'development'

const configExpress = (server, connection) => {
  if (isInDevelopment) {
    const compiler = webpack(webpackConfig)

    // Setup Hot Module Replacement for client with webpack
    server.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }))

    server.use(webpackHotMiddleware(compiler))
  }

  // Compression middleware (deflate, gzip)
  server.use(compression())

  // Static files middleware
  server.use('/public', express.static(path.resolve(__dirname, '../public')))

  // Logging middleware
  server.use(morgan(isInDevelopment ? 'dev' : 'combined'))

  // bodyParser should be above methodOverride
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))

  server.use(multer().any())

  // https://github.com/expressjs/method-override#custom-logic
  server.use(methodOverride((req) => {
    // look in urlencoded POST bodies and delete it
    if (req.body && req.body._method) {
      const method = req.body._method
      delete req.body._method
      return method
    }
  }))

  // CookieParser should be above session
  server.use(cookieParser())
  server.use(cookieSession({ secret: process.env.SECRET }))

  server.use(session({
    resave: false,
    secret: process.env.SECRET,
    saveUninitialized: true,
    store: new MongoStore({
      ttl: 604800,
      touchAfter: (24 * 3600),
      collection: 'sessions',
      mongooseConnection: connection
    }),
    cookie : {
      maxAge: 604800,
      httpOnly: true
    }
  }))

  // use passport session
  server.use(passport.initialize())
  server.use(passport.session())

  // adds CSRF support
  server.use(csrf())

  server.use((req, res, next) => {
    res.locals.csrf = req.csrfToken()
    next()
  })

  // Bootstrap routes
  configRoutes(server)

  // Setup view engine
  server.set('views', path.join(__dirname, '../views'))
  server.set('view engine', 'ejs')
  server.use(render)
}

export default configExpress
