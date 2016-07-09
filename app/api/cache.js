import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import assign from 'lodash/assign'
import compact from 'lodash/compact'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import flattenDeep from 'lodash/flattenDeep'
import { default as Cache } from 'cacheman'

let cache = null
let mappings = {}
const CACHE_TIME = 604800 // Cache objects for one week

const getIds = (ids = []) => (
  map(uniq(compact(flattenDeep(
    isArray(ids) ? ids : [ids]
  ))), (id) => id.toString())
)

const cacheStarted = () => !isEmpty(cache)

export const startCache = (name, options) => {
  cache = new Cache(name, options)
}

export const inCache = (key) => (
  has(mappings, key) && !isEmpty(get(mappings, key))
)

export const saveToCache = (
  key, value, invalidatesWith = [], time = CACHE_TIME
) => {
  return new Promise((resolve, reject) => {
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
}

export const getFromCache = (key) => {
  return new Promise((resolve, reject) => {
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
}

export const removeFromCache = (key) => {
  return new Promise((resolve, reject) => {
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
}

export const invalidateFromCache = (ids) => (
  new Promise(async (resolve, reject) => {
    if (isEmpty(mappings)) {
      return resolve()
    }

    try {
      for (let id of getIds(ids)) {
        for (let key of keys(mappings)) {
          if (includes(get(mappings, key), id)) {
            await removeFromCache(key)
          }
        }
      }

      resolve()
    } catch (err) {
      reject(err)
    }
  })
)

export const clearCache = () => {
  return new Promise((resolve, reject) => {
    if (!cacheStarted()) {
      return resolve()
    }

    cache.clear((err) => {
      if (err) {
        return reject(err)
      }

      mappings = {}
      resolve()
    })
  })
}
