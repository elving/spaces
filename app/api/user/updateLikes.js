import get from 'lodash/get'
import set from 'lodash/set'
import concat from 'lodash/concat'
import without from 'lodash/without'
import isEqual from 'lodash/isEqual'
import toString from 'lodash/toString'

import update from './update'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'

export default (req, like, action = 'add') => (
  new Promise(async (resolve, reject) => {
    const key = isEqual(get(like, 'parentType'), 'space')
      ? 'spacesLiked'
      : 'productsLiked'

    const user = get(req, 'user', {})
    const likes = get(user, key, [])
    const parent = toString(get(like, 'parent'))
    const newLikes = isEqual(action, 'add')
      ? concat(likes, parent)
      : without(likes, parent)

    set(user, key, newLikes)

    try {
      await update(toStringId(user), { [key]: toObjectId(newLikes) })

      req.logIn(user, (err) => {
        if (err) {
          return reject(err)
        }

        resolve(user)
      })
    } catch (err) {
      reject(err)
    }
  })
)
