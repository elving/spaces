import map from 'lodash/map'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import flattenDeep from 'lodash/flattenDeep'
import { default as Cache } from 'cacheman'

let cache
let mappings = {}

const getIds = (ids) => (
  map(uniq(compact(flattenDeep(
    isArray(ids) ? ids : [ids]
  ))), (id) => id.toString())
)

export const start = (name, options) => {
  cache = new Cache(name, options)
}

export const has = (key) => (
  mappings[key] && !isEmpty(mappings[key])
)

export const set = (
  key,
  value,
  time = 604800,
  next,
  invalidatesWith = []
) => {
  if (!isEmpty(invalidatesWith)) {
    mappings[key] = getIds(invalidatesWith)
  }

  cache.set(key, value, time, next)
}

export const get = (key, next) => {
  cache.get(key, next)
}

export const remove = (key, next) => {
  if (!isEmpty(mappings[key])) {
    Reflect.deleteProperty(mappings, key)
  }

  cache.del(key, next)
}

const removePromise = (key) => {
  return new Promise((resolve, reject) => {
    remove(key, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

export const removeKeys = async (keys, next) => {
  for (let key of keys) {
    try {
      await removePromise(key)
    } catch (err) {
      return next(err)
    }
  }

  next()
}

export const invalidate = async (ids, next) => {
  const idsToInvalidate = getIds(ids)

  for (let idToInvalidate of idsToInvalidate) {
    for (let key of keys(mappings)) {
      if (includes(mappings[key], idToInvalidate)) {
        try {
          await removePromise(key)
        } catch (err) {
          return next(err)
        }
      }
    }
  }

  next()
}

export const clear = (next) => {
  mappings = {}
  cache.clear(next)
}
