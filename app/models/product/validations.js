import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

export default (schema) => {
  schema
    .path('url')
    .required(true, 'A url is required to add a product')

  schema
    .path('url')
    .validate(function(url, next) {
      if (this.isNew || this.isModified('url')) {
        mongoose
          .model('Product')
          .findOne({ url })
          .exec((err, product) => {
            next(isEmpty(err) && isEmpty(product))
          })
      } else {
        next(true)
      }
    }, 'A product with the url "{VALUE}" already exists')

  schema
    .path('name')
    .required(true, 'A name is required to add a product')

  schema
    .path('name')
    .validate(function(name, next) {
      if (this.isNew || this.isModified('name')) {
        mongoose
          .model('Product')
          .findOne({ slug: kebabCase(name) })
          .exec((err, product) => {
            next(isEmpty(err) && isEmpty(product))
          })
      } else {
        next(true)
      }
    }, 'The product "{VALUE}" already exists')

  schema
    .path('price')
    .required(true, 'A price is required to add a product')

  schema
    .path('image')
    .required(true, 'An image is required to add a product')

  schema
    .path('brand')
    .required(true, 'A brand is required to add a product')

  schema
    .path('categories')
    .required(true, 'At least one category is required to add a product')

  schema
    .path('spaceTypes')
    .required(true, 'At least one space type is required to add a product')

  schema
    .path('description')
    .validate((value) => {
      if (isEmpty(value)) {
        return true
      } else if (!isEmpty(value) && size(value) <= 500) {
        return true
      } else {
        return false
      }
    }, 'The product\'s description can\'t be longer than 500 characters')

  return schema
}
