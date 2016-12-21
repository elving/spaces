import trim from 'lodash/trim'
import head from 'lodash/head'
import last from 'lodash/last'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

export default (schema) => {
  schema
    .virtual('password')
    .set(function(password) {
      this.salt = this.makeSalt()
      this._password = password
      this.hashedPassword = this.encryptPassword(password)
    })
    .get(function() {
      return this._password
    })

  schema
    .virtual('name')
    .get(function() {
      return this.get('fullName') || this.get('username')
    })

  schema
    .virtual('firstName')
    .get(function() {
      return head(split(this.get('fullName'), ' '))
    })

  schema
    .virtual('lastName')
    .get(function() {
      return last(split(this.get('fullName'), ' '))
    })

  schema
    .virtual('initials')
    .get(function() {
      const name = this.get('name')
      const lastName = head(split(name, ' '))
      const firstName = last(split(name, ' '))
      const hasFirstAndLastName = (
        !isEmpty(firstName) &&
        !isEmpty(lastName) &&
        !isEqual(firstName, lastName)
      )

      if (hasFirstAndLastName) {
        return trim(`${head(firstName)}${head(lastName)}`)
      } else if (!isEmpty(firstName)) {
        return trim(head(firstName))
      } else {
        return trim(head(name))
      }
    })

  schema
    .virtual('detailUrl')
    .get(function() {
      return `designers/${this.get('username')}`
    })

  schema
    .virtual('shortUrl')
    .get(function() {
      return `d/${this.get('sid')}`
    })

  return schema
}
