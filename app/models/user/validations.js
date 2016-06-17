import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import endsWith from 'lodash/endsWith'
import mongoose from 'mongoose'

import { USERNAMES_BLACKLISTED } from '../../constants/usernames'

export default (schema) => {
  const isValidEmail = (str) => (
    /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(str)
  )

  schema
    .path('email')
    .required(true, 'An email is required to have an account')

  schema
    .path('email')
    .validate(function(email) {
      return isValidEmail(email)
    }, 'Email is not valid')

  schema
    .path('email')
    .validate(function(email) {
      if (!this.isNew || !this.isModified('email')) {
        return true
      }

      if (endsWith(email, '@joinspaces.co')) {
        return false
      }
    }, 'This email is already taken')

  schema
    .path('email')
    .validate(function(email, next) {
      if (this.isNew || this.isModified('email')) {
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
      } else {
        return false
      }
    }, 'Maximum 254 characters')

  schema
    .path('username')
    .required(true, 'A username is required to have an account')

  schema
    .path('username')
    .validate(function(username) {
      if (!this.isNew || !this.isModified('username')) {
        return true
      }

      return !includes(USERNAMES_BLACKLISTED, username)
    }, 'This username is already taken')

  schema
    .path('username')
    .validate(function(username, next) {
      if (this.isNew || this.isModified('username')) {
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
      if (this.isNew || this.isModified('username')) {
        return !(/\W+/gim).test(username)
      } else {
        return true
      }
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
      if (!this.isNew || !this.isModified('hashedPassword')) {
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
