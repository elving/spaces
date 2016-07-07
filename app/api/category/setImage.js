import isEmpty from 'lodash/isEmpty'

import toIds from '../utils/toIds'
import toStringId from '../utils/toStringId'
import getProducts from './getProducts'
import generateImage from '../../utils/image/generateImage'
import getProductImages from '../utils/getProductImages'
import { invalidateFromCache } from '../cache'

export default async (category) => {
  const products = await getProducts(toStringId(category), 4)

  if (!isEmpty(products)) {
    const image = await generateImage('categories', getProductImages(products))
    category.set({ image })
    category.save(() => invalidateFromCache(toIds(category)))
  }
}
