import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('name')
    .required(true, 'A name is required to add a brand')

  schema
    .path('name')
    .validate(function(name, next) {
      if (isNew(this) || isModified(this, 'name')) {
        mongoose
          .model('Brand')
          .findOne({ name })
          .exec((err, brand) => {
            next(isEmpty(err) && isEmpty(brand))
          })
      } else {
        next(true)
      }
    }, 'A brand with the name "{VALUE}" already exists')

  return schema
}
