import map from 'lodash/map'
import keys from 'lodash/keys'
import sha1 from 'sha1'
import size from 'lodash/size'
import jsosort from 'jsosort'
import isArray from 'lodash/isArray'
import Cacheman from 'cacheman'
import isRegExp from 'lodash/isRegExp'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'

class Cache {
  constructor(options) {
    this.cache = new Cacheman('mongoose-cache', options)
  }

  get(key, next = (() => {})) {
    return this.cache.get(key, next)
  }

  set(key, value, ttl, next = (() => {})) {
    if (ttl === 0) {
      ttl = -1
    }

    return this.cache.set(key, value, ttl, next)
  }

  del(key, next = (() => {})) {
    return this.cache.del(key, next)
  }

  clear(next = (() => {})) {
    return this.cache.clear(next)
  }
}

let cache
let hasRun = false
let hasBeenExtended = false

const generateKey = (obj) => {
  return sha1(JSON.stringify(jsosort(obj), (key, value) => {
    return isRegExp(value) ? String(value) : value
  }))
}

const inflateModel = (constructor, populate) => {
  const fieldsToPopulate = populate ? keys(populate) : []

  return (data) => {
    return new Promise((resolve) => {
      if (constructor.inflate) {
        return resolve(constructor.inflate(data))
      } else {
        const model = constructor(data)

        model.$__reset()
        model.isNew = false

        if (size(fieldsToPopulate)) {
          for (let field of fieldsToPopulate) {
            if (data[field]) {
              model.set(field, map(data[field], (populated) => populated._id))
              model.populate(populate[field])
            }
          }

          return model.execPopulate().then(resolve)
        } else {
          return resolve(model)
        }
      }
    })
  }
}

export const init = (mongoose, options) => {
  if (hasRun) {
    return
  }

  cache = new Cache(options)
  hasRun = true

  const exec = mongoose.Query.prototype.exec

  mongoose.Query.prototype.exec = function(op, next = (() => {})) {
    if (!this.hasOwnProperty('_ttl')) {
      return exec.apply(this, arguments)
    }

    if (isFunction(op)) {
      next = op
      op = null
    } else if (isString(op)) {
      this.op = op
    }

    const key = this._key || this.getCacheKey()
    const ttl = this._ttl
    const model = this.model.modelName
    const isLean = this._mongooseOptions.lean
    const promise = new mongoose.Promise()
    const populate = this._mongooseOptions.populate

    promise.onResolve(next)

    cache.get(key, (err, cached) => {
      if (cached) {
        if (!isLean) {
          const constructor = mongoose.model(model)

          if (isArray(cached)) {
            const inflateModels = map(
              cached, inflateModel(constructor, populate)
            )

            Promise.all(inflateModels).then((models) => {
              promise.resolve(null, models)
            })
          } else {
            inflateModel(constructor, populate)(cached).then((model) => {
              promise.resolve(null, model)
            })
          }
        } else {
          promise.resolve(null, cached)
        }
      } else {
        exec.call(this).onResolve((err, results) => {
          if (err) {
            return promise.resolve(err)
          }

          cache.set(key, results, ttl, () => {
            promise.resolve(null, results)
          })
        })
      }
    })

    return promise
  }

  mongoose.Query.prototype.cache = function(ttl = 60, customKey = '') {
    if (isString(ttl)) {
      customKey = ttl
      ttl = 60
    }

    this._ttl = ttl
    this._key = customKey
    return this
  }

  mongoose.Query.prototype.getCacheKey = function() {
    return generateKey({
      op: this.op,
      skip: this.options.skip,
      model: this.model.modelName,
      limit: this.options.limit,
      _path: this._path,
      _fields: this._fields,
      _options: this._mongooseOptions,
      _distinct: this._distinct,
      _conditions: this._conditions
    })
  }

  const aggregate = mongoose.Model.aggregate

  mongoose.Model.aggregate = function() {
    const aggregated = aggregate.apply(this, arguments)

    if (!hasBeenExtended &&
      aggregated.constructor &&
      aggregated.constructor.name === 'Aggregate') {
      const Aggregate = aggregated.constructor
      const aggregateExec = Aggregate.prototype.exec

      Aggregate.prototype.exec = function(next) {
        if (!this.hasOwnProperty('_ttl')) {
          return aggregateExec.apply(this, arguments)
        }

        const key = this._key || this.getCacheKey()
        const ttl = this._ttl
        const promise = new mongoose.Promise()

        promise.onResolve(next)

        cache.get(key, (err, cached) => {
          if (cached) {
            promise.resolve(null, cached)
          } else {
            aggregateExec.call(this).onResolve((err, results) => {
              if (err) {
                return promise.resolve(err)
              }

              cache.set(key, results, ttl, () => {
                promise.resolve(null, results)
              })
            })
          }
        })

        return promise
      }

      Aggregate.prototype.cache = function(ttl = 60, customKey = '') {
        if (isString(ttl)) {
          customKey = ttl
          ttl = 60
        }

        this._ttl = ttl
        this._key = customKey
        return this
      }

      Aggregate.prototype.getCacheKey = function() {
        return generateKey(this._pipeline)
      }

      hasBeenExtended = true
    }

    return aggregated
  }
}

export const clearCache = (key, next = (() => {})) => {
  if (!key) {
    return cache.clear(next)
  }

  cache.del(key, next)
}
