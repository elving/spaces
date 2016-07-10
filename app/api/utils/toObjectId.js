import get from 'lodash/get'
import map from 'lodash/map'
import mongoose from 'mongoose'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'

const getObjectId = doc => {
  if (isString(doc)) {
    return mongoose.Types.ObjectId(doc)
  } else if (doc instanceof mongoose.Schema.Types.ObjectId) {
    return doc
  } else if (isObject(doc)) {
    return mongoose.Types.ObjectId(get(doc, 'id'))
  }
}

export default doc => {
  return isArray(doc) ? map(doc, getObjectId) : getObjectId(doc)
}
