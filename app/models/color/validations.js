import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .path('hex')
    .required(true, 'A hex code is required to add a color')

  schema
    .path('name')
    .required(true, 'A name is required to add a color')

  schema
    .path('name')
    .validate(function(name, next) {
      if (this.isNew || this.isModified('name')) {
        mongoose
          .model('Color')
          .findOne({ slug: kebabCase(name) })
          .exec((err, color) => {
            next(isEmpty(err) && isEmpty(color))
          })
      } else {
        next(true)
      }
    }, 'The color "{VALUE}" already exists')

  return schema
}
