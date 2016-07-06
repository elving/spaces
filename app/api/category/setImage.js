import isEmpty from 'lodash/isEmpty'

import toStringId from '../../utils/toStringId'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import { invalidateFromCache } from '../cache'
import { toIds, getProductImages } from '../utils'

export default async (category) => {
  const products = await getProducts(toStringId(category), 4)

  if (!isEmpty(products)) {
    const image = await generateImage(getProductImages(products))
    category.set({ image })
    category.save(() => invalidateFromCache(toIds(category)))
  }
}
