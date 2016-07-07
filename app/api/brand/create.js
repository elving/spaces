import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Brand = mongoose.model('Brand')
    const brand = new Brand(sanitize(props))
    const errors = brand.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    brand.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('brand-all')
      resolve(brand)
    })
  })
}
