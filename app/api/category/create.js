import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (props) => (
  new Promise(async (resolve, reject) => {
    const Category = mongoose.model('Category')
    const category = new Category(sanitize(props))
    const errors = category.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    category.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('category-all')
      await removeFromCache('category-popular-8')
      await invalidateFromCache(toStringId(category))

      resolve(category)
    })
  })
)
