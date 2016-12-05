import has from 'lodash/has'
import set from 'lodash/set'
import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import getTags from '../../utils/product/getTags'
import sanitize from './sanitize'
import isDataUrl from '../../utils/isDataUrl'
import toStringId from '../utils/toStringId'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import toIdsFromPath from '../utils/toIdsFromPath'
import getProductImages from '../utils/getProductImages'
import uploadImageFromDataUrl from '../../utils/image/uploadImageFromDataUrl'
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default props => (
  new Promise(async (resolve, reject) => {
    const Space = mongoose.model('Space')

    let products = []
    let updatedProps = sanitize(props)

    if (has(updatedProps, 'products')) {
      try {
        products = await getProducts(updatedProps.products)
        updatedProps = assign({}, updatedProps, getTags(products))
      } catch (getProductsErr) {
        return reject(getProductsErr)
      }
    }

    if (has(updatedProps, 'coverImage') && isDataUrl(updatedProps.coverImage)) {
      try {
        const coverImage = await uploadImageFromDataUrl(
          'spaces', updatedProps.coverImage
        )

        set(updatedProps, 'coverImage', coverImage)
      } catch (err) {
        return reject(err)
      }
    }

    const space = new Space(updatedProps)
    const errors = space.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    if (!isEmpty(products)) {
      space.productImages = getProductImages(products)
      space.shouldUpdateImage = true
    }

    space.save((err, savedSpace) => {
      if (err) {
        return reject(parseError(err))
      }

      const id = toStringId(savedSpace)

      savedSpace
        .populate('products')
        .populate('createdBy')
        .populate('spaceType')
        .populate({
          path: 'originalSpace',
          options: {
            populate: 'createdBy'
          }
        }, async (populationErr, populatedSpace) => {
          if (populationErr) {
            return reject(parseError(populationErr))
          }

          await removeFromCache('space-all')
          await removeFromCache('space-latest')
          await removeFromCache('space-popular-8')
          await removeFromCache(`redesigns-all-${id}`)

          await invalidateFromCache([
            id,
            toIdsFromPath(savedSpace, 'products'),
            toIdsFromPath(savedSpace, 'createdBy'),
            toIdsFromPath(savedSpace, 'savedSpaceType'),
            toIdsFromPath(savedSpace, 'redesigns'),
            toIdsFromPath(savedSpace, 'categories'),
            toIdsFromPath(savedSpace, 'originalSpace')
          ])

          resolve(populatedSpace)
        })
    })
  })
)
