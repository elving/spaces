import has from 'lodash/has'
import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
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
    set(mappings, key, getIds(invalidatesWith))

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
    Reflect.deleteProperty(mappings, key)

    cache.del(key, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

export const invalidateFromCache = (ids) => {
  return new Promise(async (resolve, reject) => {
    for (let id of getIds(ids)) {
      for (let key of keys(mappings)) {
        if (includes(get(mappings, key), id)) {
          try {
            await removeFromCache(key)
          } catch (err) {
            return reject(err)
          }
        }
      }
    }

    resolve()
  })
}

export const clearCache = () => {
  return new Promise((resolve, reject) => {
    cache.clear((err) => {
      if (err) {
        return reject(err)
      }

      mappings = {}
      resolve()
    })
  })
}
