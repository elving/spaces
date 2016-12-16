import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('name')
    .required(true, 'A name is required to add a guide')

  schema
    .path('name')
    .validate(function(name, next) {
      if (isNew(this) || isModified(this, 'name')) {
        mongoose
          .model('Guide')
          .findOne({ name })
          .exec((err, guide) => {
            next(isEmpty(err) && isEmpty(guide))
          })
      } else {
        next(true)
      }
    }, 'A guide with the name "{VALUE}" already exists')

  return schema
}
