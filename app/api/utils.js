import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import keys from 'lodash/keys'
import split from 'lodash/split'
import result from 'lodash/result'
import compact from 'lodash/compact'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import mongoose from 'mongoose'
import flattenDeep from 'lodash/flattenDeep'

import { inCache, getFromCache } from './cache'

export const parseError = (err) => {
  const errors = get(err, 'errors')
  const fieldErrors = {}

  if (!isEmpty(errors)) {
    forEach(keys(errors), (field) => {
      const fieldName = field === 'hashedPassword' ? 'password' : field

      fieldErrors[fieldName] = get(
        errors[field], 'message', 'Something went wrong...'
      )
    })

    return fieldErrors
  } else {
    return err
  }
}

export const toIds = (docs) => {
  docs = isArray(docs) ? docs : [docs]
  return flattenDeep(map(docs, (doc) => get(doc, 'id')))
}

export const toIdsFromPath = (docs, path) => {
  docs = isArray(docs) ? docs : [docs]
  return flattenDeep(map(docs, (doc) => toIds(get(doc, path, doc))))
}

export const toJSON = (value) => {
  return isArray(value) ? map(value, (doc) => (
    result(doc, 'toJSON', (!isEmpty(doc) ? doc : {}))
  )) : (
    result(value, 'toJSON', (!isEmpty(value) ? value : {}))
  )
}

export const toObjectId = (value) => {
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

export const getFromCacheOrQuery = async (key, query, resolve) => {
  if (!inCache(key)) {
    return query()
  }

  try {
    const data = await getFromCache(key)

    if (isEmpty(data)) {
      query()
    } else {
      resolve(data)
    }
  } catch (err) {
    query()
  }
}

export const populate = (models, options) => {
  return new Promise(async (resolve, reject) => {
    models = isArray(models) ? models : [models]
    options = isArray(options) ? options : [options]

    forEach(models, (model) => {
      forEach(options, (option) => {
        model.populate(option)
      })
    })

    try {
      for (let model of models) {
        await model.execPopulate()
      }

      resolve(models)
    } catch (err) {
      reject(err)
    }
  })
}


export const makeSearchQuery = (params = {}) => {
  const query = {}

  if (has(params, 'name')) {
    query.name = {
      $regex: get(params, 'name', ''),
      $options: 'i'
    }
  }

  if (has(params, 'username')) {
    query.username = {
      $regex: get(params, 'username', ''),
      $options: 'i'
    }
  }

  if (has(params, 'brands')) {
    query.brand = {
      $in: split(
        get(params, 'brands', []), ','
      )
    }
  }

  if (has(params, 'colors')) {
    query.colors = {
      $in: split(
        get(params, 'colors', []), ','
      )
    }
  }

  if (has(params, 'categories')) {
    query.categories = {
      $in: split(
        get(params, 'categories', []), ','
      )
    }
  }

  if (has(params, 'spaceTypes')) {
    query.spaceTypes = {
      $in: split(
        get(params, 'spaceTypes', []), ','
      )
    }
  }

  return query
}

export const getProductImages = (products = []) => (
  compact(map(products, product => get(product, 'image')))
)
