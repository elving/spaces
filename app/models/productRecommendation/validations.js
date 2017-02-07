import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('url')
    .required(true, 'A url is required to add a brand')

  schema
    .path('url')
    .validate(function(url, next) {
      if (isNew(this) || isModified(this, 'url')) {
        mongoose
          .model('ProductRecommendation')
          .findOne({ url })
          .exec((err, recommendation) => {
            next(isEmpty(err) && isEmpty(recommendation))
          })
      } else {
        next(true)
      }
    }, 'This product has already been recommended')

  schema
    .path('url')
    .validate(function(url, next) {
      if (isNew(this) || isModified(this, 'url')) {
        mongoose
          .model('Product')
          .findOne({ url })
          .exec((err, product) => {
            next(isEmpty(err) && isEmpty(product))
          })
      } else {
        next(true)
      }
    }, 'This product already exists')

  return schema
}
