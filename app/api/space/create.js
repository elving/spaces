import get from 'lodash/get'
import map from 'lodash/map'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import generateHeader from '../../utils/space/generateHeader'

import { toIds, parseError } from '../utils'
import { removeFromCache, invalidateFromCache } from '../cache'

export default (props) => {
  return new Promise(async (resolve, reject) => {
    const Space = mongoose.model('Space')
    const space = new Space(sanitize(props))
    const errors = space.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    space.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      space
        .populate('products')
        .populate('createdBy')
        .populate('spaceType')
        .populate('originalSpace', async (err, space) => {
          generateHeader(
            compact(map(space.get('products'), (product) => (
              get(product, 'image')
            )))
          ).then((image) => {
            space.set({ image })
            space.save(() => invalidateFromCache(toIds(space)))
          })

          await removeFromCache('space-all')
          await removeFromCache('space-latest')
          await removeFromCache(`space-all-${get(props, 'createdBy')}`)

          resolve(space)
        })
    })
  })
}
