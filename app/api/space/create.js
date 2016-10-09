import has from 'lodash/has'
import set from 'lodash/set'
import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import getTags from '../../utils/product/getTags'
import sanitize from './sanitize'
import isDataUrl from '../../utils/isDataUrl'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import getProductImages from '../utils/getProductImages'
import uploadImageFromDataUrl from '../../utils/image/uploadImageFromDataUrl'

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

      savedSpace
        .populate('products')
        .populate('createdBy')
        .populate('spaceType')
        .populate('originalSpace', async (populationErr, populatedSpace) => {
          if (populationErr) {
            return reject(parseError(populationErr))
          }

          resolve(populatedSpace)
        })
    })
  })
)
