import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import generateImage from '../../utils/image/generateImage'

import toIds from '../utils/toIds'
import parseError from '../utils/parseError'
import getProductImages from '../utils/getProductImages'
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
          try {
            generateImage('spaces', getProductImages(space.get('products')))
              .then((image) => {
                space.set({ image })
                space.save(() => invalidateFromCache(toIds(space)))
              })
          } catch (err) {

          }

          await removeFromCache('space-all')
          await removeFromCache('space-latest')

          resolve(space)
        })
    })
  })
}
