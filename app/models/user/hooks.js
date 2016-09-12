import isEmpty from 'lodash/isEmpty'

export default (schema) => {
  const handleDuplicateError = (err, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new Error('There was a duplicate key error'))
    } else {
      next()
    }
  }

  schema.pre('save', function(next) {
    if (!this.isNew) {
      return next()
    }

    if (isEmpty(this.password)) {
      next(new Error('Invalid password'))
    } else {
      next()
    }
  })

  schema.post('save', handleDuplicateError)
  schema.post('update', handleDuplicateError)
  schema.post('insertMany', handleDuplicateError)
  schema.post('findOneAndUpdate', handleDuplicateError)
}
