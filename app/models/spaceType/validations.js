import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import isNew from '../utils/isNew'
import isModified from '../utils/isModified'

export default schema => {
  schema
    .path('name')
    .required(true, 'A name is required to add a spaceType')

  schema
    .path('name')
    .validate(function(name, next) {
      if (isNew(this) || isModified(this, 'name')) {
        mongoose
          .model('SpaceType')
          .findOne({ slug: kebabCase(name) })
          .exec((err, spaceType) => {
            next(isEmpty(err) && isEmpty(spaceType))
          })
      } else {
        next(true)
      }
    }, 'The spaceType "{VALUE}" already exists')

  return schema
}
