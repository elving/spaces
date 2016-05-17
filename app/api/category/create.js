import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import { parseError } from '../utils'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Category = mongoose.model('Category')
    const category = new Category(sanitize(props))
    const errors = category.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    category.save((err) => {
      if (err) {
        return reject(parseError(err))
      }

      resolve(category)
    })
  })
}
