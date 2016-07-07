import get from 'lodash/get'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Like = mongoose.model('Like')
    const like = new Like(sanitize(props))

    like.save(async (err, like) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache(`like-all-${get(props, 'parent')}`)
      resolve(like)
    })
  })
}
