import isEmpty from 'lodash/isEmpty'

export default (schema) => {
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
}
