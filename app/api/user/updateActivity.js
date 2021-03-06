import get from 'lodash/get'
import set from 'lodash/set'
import concat from 'lodash/concat'
import without from 'lodash/without'
import isEqual from 'lodash/isEqual'
import toString from 'lodash/toString'

import update from './update'
import toStringId from '../utils/toStringId'
import toObjectId from '../utils/toObjectId'

export default (req, key, value, action = 'add') => (
  new Promise(async (resolve, reject) => {
    const user = get(req, 'user', {})
    const parent = toString(get(value, 'parent'))
    const values = get(user, key, [])
    const newValues = isEqual(action, 'add')
      ? concat(values, parent)
      : without(values, parent)

    set(user, key, newValues)

    try {
      await update(toStringId(user), {
        [key]: toObjectId(newValues)
      })

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
