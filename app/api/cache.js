import map from 'lodash/map'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import assign from 'lodash/assign'
import compact from 'lodash/compact'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import flattenDeep from 'lodash/flattenDeep'
import intersection from 'lodash/intersection'
import { default as Cache } from 'cacheman'

import toStringId from './utils/toStringId'

let cache = null
let mappings = {}
const CACHE_TIME = 604800 // Cache objects for one week

const getIds = (ids = []) => uniq(
  map(
    compact(
      flattenDeep(isArray(ids) ? ids : [ids])
    ),
    id => toStringId(id)
  )
)

const cacheStarted = () => !isEmpty(cache)

export const startCache = (name, options) => {
  cache = new Cache(name, options)
}

export const inCache = key => !isEmpty(mappings[key])

export const saveToCache = (
  key, value, invalidatesWith = [], time = CACHE_TIME
) => new Promise((resolve, reject) => {
  if (!cacheStarted()) {
    return resolve()
  }

  mappings = assign({}, mappings, {
    [key]: getIds(invalidatesWith)
  })

  cache.set(key, value, time, (err) => {
    if (err) {
      return reject(err)
    }

    resolve()
  })
})

export const getFromCache = key => (
  new Promise((resolve, reject) => {
    if (!cacheStarted()) {
      return resolve()
    }

    if (!inCache(key)) {
      return resolve()
    }

    cache.get(key, (err, value) => {
      if (err) {
        return reject(err)
      }

      resolve(value)
    })
  })
)

export const removeFromCache = key => (
  new Promise((resolve, reject) => {
    if (!cacheStarted()) {
      return resolve()
    }

    Reflect.deleteProperty(mappings, key)

    cache.del(key, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
)

export const invalidateFromCache = (ids) => (
  new Promise(async (resolve, reject) => {
    if (isEmpty(mappings)) {
      return resolve()
    }

    let key

    try {
      for (key of keys(mappings)) {
        if (!isEmpty(intersection(mappings[key], getIds(ids)))) {
          await removeFromCache(key)
        }
      }

      resolve()
    } catch (err) {
      reject(err)
    }
  })
)

export const clearCache = () => (
  new Promise((resolve, reject) => {
    if (!cacheStarted()) {
      return resolve()
    }

    mappings = {}

    cache.clear((err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
)
