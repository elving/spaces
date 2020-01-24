import get from 'lodash/get'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { removeFromCache } from '../cache'

export default (props) => (
  new Promise(async (resolve, reject) => {
    const Follow = mongoose.model('Follow')
    const follow = new Follow(sanitize(props))

    follow.save(async (err, updatedFollow) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache(`follow-all-${get(props, 'parent')}`)
      return resolve(updatedFollow)
    })
  })
)
