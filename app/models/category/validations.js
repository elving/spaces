import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('name')
    .required(true, 'A name is required to add a category')

  schema
    .path('name')
    .validate(function(name, next) {
      if (isNew(this) || isModified(this, 'name')) {
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
