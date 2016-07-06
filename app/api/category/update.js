import mongoose from 'mongoose'

import sanitize from './sanitize'
import setImage from './setImage'
import toStringId from '../../utils/toStringId'
import { parseError } from '../utils'
import { invalidateFromCache } from '../cache'

export default (_id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updates = sanitize(props, false)
      const options = { new: true }

      mongoose
        .model('Category')
        .findOneAndUpdate({ _id }, updates, options, async (err, category) => {
          if (err) {
            return reject(parseError(err))
          }

          await invalidateFromCache(toStringId(category))
          setImage(category)
          resolve(category)
        })
    } catch (err) {
      reject(err)
    }
  })
}
