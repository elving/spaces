import get from 'lodash/get'
import map from 'lodash/map'
import mongoose from 'mongoose'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'

export default (value) => {
  const getObjectId = (value) => {
    if (isString(value)) {
      return mongoose.Types.ObjectId(value)
    } else if (value instanceof mongoose.Schema.Types.ObjectId) {
      return value
    } else if (isObject(value)) {
      return mongoose.Types.ObjectId(get(value, 'id'))
    }
  }

  return isArray(value) ? map(value, getObjectId) : getObjectId(value)
}
