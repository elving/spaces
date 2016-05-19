import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import keys from 'lodash/keys'
import split from 'lodash/split'
import result from 'lodash/result'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import toString from 'lodash/toString'
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
  return flattenDeep(map(docs, (doc) => toString(doc.get('id'))))
}

export const toIdsFromPath = (docs, path = 'id') => {
  docs = isArray(docs) ? docs : [docs]

  return flattenDeep(
    map(docs, (doc) => {
      let pathValue
      pathValue = doc.get(path)
      pathValue = isArray(pathValue) ? pathValue : [pathValue]
      return map(pathValue, (value) => toString(value))
    })
  )
}

export const toJSON = (docs) => {
  docs = isArray(docs) ? docs : [docs]
  return map(docs, (doc) => result(doc, 'toJSON', {}))
}

export const getFromCacheOrQuery = async (key, query, resolve) => {
  if (inCache(key)) {
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
  } else {
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
