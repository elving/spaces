import isEmpty from 'lodash/isEmpty'
import { Strategy as LocalStrategy } from 'passport-local'

import find from '../../api/user/find'

export default new LocalStrategy({
  usernameField: 'emailOrUsername',
  passwordField: 'password'
}, async (emailOrUsername, password, done) => {
  try {
    const user = await find(emailOrUsername)

    if (isEmpty(user) || !user.authenticate(password)) {
      return done(null, false, {
        message: 'The credentials you provided are incorrect. Please try again.'
      })
    }

    done(null, user)
  } catch (err) {
    done(err)
  }
})
