import isEmpty from 'lodash/isEmpty'
import { Strategy as LocalStrategy } from 'passport-local'
import { default as findUser } from '../../api/user/find'

const message = (
  'The credentials you provided are incorrect. Please try again.'
)

export default new LocalStrategy({
  usernameField: 'emailOrUsername',
  passwordField: 'password'
}, async (emailOrUsername, password, done) => {
  try {
    const user = await findUser(emailOrUsername)

    if (isEmpty(user) || !user.authenticate(password)) {
      return done(null, false, { message })
    }

    done(null, user)
  } catch (err) {
    done(err)
  }
})
