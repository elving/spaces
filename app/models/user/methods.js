import crypto from 'crypto'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export default (schema) => {
  schema.methods = {
    authenticate(password) {
      return isEqual(this.encryptPassword(password), this.hashedPassword)
    },

    makeSalt() {
      return `${Math.round((new Date().valueOf() * Math.random()))}`
    },

    encryptPassword(password) {
      if (isEmpty(password)) {
        return ''
      }

      try {
        return (
          crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        )
      } catch (err) {
        return ''
      }
    }
  }

  return schema
}
