import isEmpty from 'lodash/isEmpty'

export default (schema) => {
  schema
    .path('title')
    .required(true, 'Space title cannot be blank')

  schema
    .path('category')
    .required(true, 'Space category cannot be blank')

  schema
    .path('images')
    .validate((value) => {
      return !isEmpty(value)
    }, 'Space has to have an image')

  schema
    .path('products')
    .validate((value) => {
      return !isEmpty(value)
    }, 'Space has to have products')

  return schema
}
