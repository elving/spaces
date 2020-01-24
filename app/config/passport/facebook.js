import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import { Strategy as FacebookStrategy } from 'passport-facebook'

export default () => {
  const FACEBOOK_ID = process.env.FACEBOOK_ID
  const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET
  const FACEBOOK_CALLBACK = process.env.NODE_ENV === 'development'
    ? process.env.FACEBOOK_CALLBACK_DEV
    : process.env.FACEBOOK_CALLBACK_PROD

  return new FacebookStrategy({
    clientID: FACEBOOK_ID,
    callbackURL: FACEBOOK_CALLBACK,
    clientSecret: FACEBOOK_SECRET,
    profileFields: ['emails', 'photos', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const profileData = {
      email: get(profile, '_json.email'),
      avatar: `https://graph.facebook.com/${get(profile, '_json.id')}/picture?width=320&height=320`,
      fullName: get(profile, '_json.name')
    }

    mongoose
      .model('User')
      .findOne({ email: profileData.email }, (err, user) => {
        if (err) {
          return done(err)
        }

        if (!isEmpty(user)) {
          return done(null, user.toJSON())
        }

        done(null, profileData)
      })
  })
}
