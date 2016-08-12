import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import isNew from '../utils/isNew'
import isEmail from '../../utils/isEmail'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('email')
    .required(true, 'An email is required to have an account')

  schema
    .path('email')
    .validate(function(email) {
      return isEmail(email)
    }, 'Email is not valid')

  schema
    .path('email')
    .validate(function(email, next) {
      if (isNew(this) || isModified(this, 'email')) {
        mongoose
          .model('User')
          .findOne({ email })
          .exec((err, user) => {
            next(isEmpty(err) && isEmpty(user))
          })
      } else {
        next(true)
      }
    }, 'This email is already taken')

  schema
    .path('email')
    .validate(function(value) {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 254) {
        return true
      }

      return false
    }, 'Maximum 254 characters')

  schema
    .path('username')
    .required(true, 'A username is required to have an account')

  schema
    .path('username')
    .validate(function(username, next) {
      if (isNew(this) || isModified(this, 'username')) {
        mongoose
          .model('User')
          .findOne({ username })
          .exec((err, user) => {
            next(isEmpty(err) && isEmpty(user))
          })
      } else {
        next(true)
      }
    }, 'This username is already taken')

  schema
    .path('username')
    .validate(function(username) {
      if (isNew(this) || isModified(this, 'username')) {
        return !(/\W+/gim).test(username)
      }

      return true
    }, 'This username contains invalid characters')

  schema
    .path('username')
    .validate(function(username) {
      return size(username) >= 2
    }, 'Username must have at least 2 characters.')

  schema
    .path('username')
    .validate(function(value) {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 80) {
        return true
      } else {
        return false
      }
    }, 'Maximum 80 characters')

  schema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
      return !isEmpty(hashedPassword)
    }, 'A password is required to have an account')

  schema
    .path('hashedPassword')
    .validate(function() {
      if (!isNew(this) || !isModified(this, 'hashedPassword')) {
        return true
      }

      return size(this.get('password')) >= 8
    }, 'Password must have at least 8 characters.')

  schema
    .path('bio')
    .validate(function(value) {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 165) {
        return true
      } else {
        return false
      }
    }, 'Maximum 165 characters')

  return schema
}
