import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .path('name')
    .required(true, 'A name is required to add a category')

  schema
    .path('name')
    .validate(function(name, next) {
      if (this.isNew || this.isModified('name')) {
        mongoose
          .model('Category')
          .findOne({ slug: kebabCase(name) })
          .exec((err, category) => {
            next(isEmpty(err) && isEmpty(category))
          })
      } else {
        next(true)
      }
    }, 'The category "{VALUE}" already exists')

  return schema
}
