import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('hex')
    .required(true, 'A hex code is required to add a color')

  schema
    .path('name')
    .required(true, 'A name is required to add a color')

  schema
    .path('name')
    .validate(function(name, next) {
      if (isNew(this) || isModified(this, 'name')) {
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
