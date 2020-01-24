import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import { saveToCache } from '../cache'
import reverseKebabCase from '../../utils/reverseKebabCase'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

export default (name, returnDocument = false) => (
  new Promise((resolve, reject) => {
    const key = `spaceType-${kebabCase(name)}`

    const query = () => {
      mongoose
        .model('SpaceType')
        .findOne({ name: reverseKebabCase(name) })
        .populate('categories')
        .exec(async (err, spaceType = {}) => {
          if (err) {
            return reject(parseError(err))
          }

          if (!isEmpty(spaceType)) {
            await saveToCache(key, toJSON(spaceType), toIds(spaceType))
            resolve(spaceType)
          } else {
            resolve({})
          }
        })
    }

    if (returnDocument) {
      query()
    } else {
      getFromCacheOrQuery(key, query, resolve)
    }
  })
)
