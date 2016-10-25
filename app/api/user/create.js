import get from 'lodash/get'
import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import toStringId from '../utils/toStringId'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (props) => (
  new Promise((resolve, reject) => {
    const User = mongoose.model('User')
    const user = new User(assign({
      settings: { onboarding: true }
    }, sanitize(props)))
    const errors = user.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    user.save(async (err, savedUser) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache(`user-${toStringId(savedUser)}`)
      await removeFromCache(`user-${get(savedUser, 'username')}`)
      await removeFromCache(`user-likes-${toStringId(savedUser)}`)
      await removeFromCache(`user-follows-${toStringId(savedUser)}`)
      await removeFromCache('user-popular-8')
      await invalidateFromCache(toStringId(savedUser))

      resolve(savedUser)
    })
  })
)
