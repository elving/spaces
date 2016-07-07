import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import { removeFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const SpaceType = mongoose.model('SpaceType')
    const spaceType = new SpaceType(sanitize(props))
    const errors = spaceType.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    spaceType.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('spaceType-all')
      resolve(spaceType)
    })
  })
}
