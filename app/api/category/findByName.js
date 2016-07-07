import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import reverseKebabCase from '../../utils/reverseKebabCase'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (name, returnDocument = false) => {
  return new Promise((resolve, reject) => {
    const key = `category-${kebabCase(name)}`

    const query = () => {
      mongoose
        .model('Category')
        .findOne({ name: reverseKebabCase(name) })
        .exec(async (err, category) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(category)) {
            await saveToCache(key, toJSON(category), toIds(category))
            resolve(category)
          } else {
            resolve()
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
}
