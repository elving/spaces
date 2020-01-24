import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import passport from 'passport'

import local from './passport/local'
import twitter from './passport/twitter'
import facebook from './passport/facebook'

import findById from '../api/user/findById'
import toStringId from '../api/utils/toStringId'

const configPassport = () => {
  passport.serializeUser((user, done) => {
    const id = toStringId(user)
    done(null, isEmpty(id) ? user : id)
  })

  passport.deserializeUser(async (id, done) => {
    if (!isString(id)) {
      return done(null, id)
    }

    try {
      done(null, await findById(id))
    } catch (err) {
      done(err)
    }
  })

  passport.use(local)
  passport.use(twitter())
  passport.use(facebook())
}

export default configPassport
