import isEmpty from 'lodash/isEmpty'
import passport from 'passport'
import isFunction from 'lodash/isFunction'

import local from './passport/local'
import twitter from './passport/twitter'
import facebook from './passport/facebook'

const configPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, !isEmpty(user) && isFunction(user.toJSON) ? user.toJSON() : user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(local)
  passport.use(twitter())
  passport.use(facebook())
}

export default configPassport
