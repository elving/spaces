import has from 'lodash/has'
import get from 'lodash/get'
import set from 'lodash/set'
import size from 'lodash/size'
import assign from 'lodash/assign'
import isEmpty from 'lodash/isEmpty'

import toIds from '../../api/utils/toIds'
import getTags from '../../utils/product/getTags'
import sanitize from './sanitize'
import findById from './findById'
import isDataUrl from '../../utils/isDataUrl'
import parseError from '../utils/parseError'
import getProducts from './getProducts'
import getProductImages from '../utils/getProductImages'
import uploadImageFromDataUrl from '../../utils/image/uploadImageFromDataUrl'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    try {
      let updates = sanitize(props)
      const space = await findById(_id)

      space.wasNew = false

      if (size(updates) === 1 && has(updates, 'image')) {
        space.skipPostSaveHook = true
      }

      if (has(updates, 'products')) {
        try {
          const products = await getProducts(updates.products)

          updates = assign({}, updates, getTags(products))
          space.productImages = getProductImages(products)
          space.productCategories = toIds(get(updates, 'categories', []))
          space.shouldUpdateImage = true
          space.shouldUpdateCategories = true
        } catch (err) {
          return reject(err)
        }
      }

      if (has(updates, 'coverImage') && isDataUrl(updates.coverImage)) {
        try {
          const coverImage = await uploadImageFromDataUrl(
            'spaces', updates.coverImage
          )

          set(updates, 'coverImage', coverImage)
        } catch (err) {
          return reject(err)
        }
      }

      space.set(updates)

      const errors = space.validateSync()

      if (!isEmpty(errors)) {
        return reject(parseError(errors))
      }

      space.save(async (err, savedSpace) => {
        if (err) {
          return reject(parseError(err))
        }

        savedSpace
          .populate('createdBy')
          .populate('spaceType', (populationErr, populatedSpace) => {
            if (populationErr) {
              return reject(parseError(err))
            }

            resolve(populatedSpace)
          })
      })
    } catch (err) {
      reject(parseError(err))
    }
  })
)
