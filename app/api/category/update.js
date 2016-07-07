import mongoose from 'mongoose'

import sanitize from './sanitize'
import setImage from './setImage'
import parseError from '../utils/parseError'
import { invalidateFromCache } from '../cache'

export default (_id, props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updates = sanitize(props)
      const options = { new: true }

      mongoose
        .model('Category')
        .findOneAndUpdate({ _id }, updates, options, async (err, category) => {
          if (err) {
            return reject(parseError(err))
          }

          await invalidateFromCache(_id)
          setImage(category)
          resolve(category)
        })
    } catch (err) {
      reject(err)
    }
  })
}
