import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import setImage from './setImage'

import { parseError } from '../utils'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
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
      setImage(category)
      resolve(category)
    })
  })
}
