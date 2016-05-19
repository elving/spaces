import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import { parseError } from '../utils'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Color = mongoose.model('Color')
    const color = new Color(sanitize(props))
    const errors = color.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    color.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('color-all')
      resolve(color)
    })
  })
}
