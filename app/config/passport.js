import passport from 'passport'

import local from './passport/local'
import twitter from './passport/twitter'
import facebook from './passport/facebook'

import findById from '../api/user/findById'
import toStringId from '../api/utils/toStringId'

const configPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, toStringId(user))
  })

  passport.deserializeUser(async (id, done) => {
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
