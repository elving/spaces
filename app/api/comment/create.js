import get from 'lodash/get'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import { parseError } from '../utils'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Comment = mongoose.model('Comment')
    const comment = new Comment(sanitize(props))

    comment.save(async (err, comment) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache(`comment-all-${get(props, 'parent')}`)
      resolve(comment)
    })
  })
}
