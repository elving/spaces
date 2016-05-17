import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import { Strategy as TwitterStrategy } from 'passport-twitter'

export default () => {
  const TWITTER_ID = process.env.TWITTER_ID
  const TWITTER_SECRET = process.env.TWITTER_SECRET
  const TWITTER_CALLBACK = process.env.NODE_ENV === 'development'
    ? process.env.TWITTER_CALLBACK_DEV
    : process.env.TWITTER_CALLBACK_PROD

  return new TwitterStrategy({
    consumerKey: TWITTER_ID,
    callbackURL: TWITTER_CALLBACK,
    consumerSecret: TWITTER_SECRET
  }, (token, tokenSecret, profile, done) => {
    const profileData = {
      bio: get(profile, '_json.description'),
      avatar: get(profile, '_json.profile_image_url_https'),
      fullName: get(profile, '_json.name'),
      username: get(profile, '_json.screen_name')
    }

    mongoose
      .model('User')
      .findOne({ username: profileData.username }, (err, user) => {
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
