import get from 'lodash/get'
import without from 'lodash/without'

import logError from '../../utils/logError'
import setImage from '../../api/category/setImage'
import getSpaces from '../../api/space/where'
import toObjectId from '../../api/utils/toObjectId'
import toStringId from '../../api/utils/toStringId'
import getFollows from '../../api/follow/getAll'
import updateUser from '../../api/user/update'
import updateSpace from '../../api/space/update'
import getProducts from '../../api/product/where'
import deleteImage from '../../utils/image/deleteImage'
import updateProduct from '../../api/product/update'
import destroyFollow from '../../api/follow/destroyById'

export default (schema) => {
  schema.post('findOneAndUpdate', async (category) => {
    try {
      await setImage(category)
    } catch (err) {
      logError(err)
    }
  })

  schema.post('findOneAndRemove', async (category) => {
    const id = toStringId(category)

    const products = await getProducts({
      categories: [id]
    })

    for (const product of products) {
      const productId = toStringId(product)
      const productCategories = get(product, 'categories', [])

      await updateProduct(productId, {
        categories: without(productCategories, id)
      })
    }

    const spaces = await getSpaces({
      categories: id
    })

    for (const space of spaces) {
      const spaceId = toStringId(space)
      const spaceCategories = get(space, 'categories', [])

      await updateSpace(spaceId, {
        categories: without(spaceCategories, id)
      })
    }

    const follows = await getFollows(id)

    for (const follow of follows) {
      await updateUser(toStringId(get(follow, 'createdBy')), {
        $pull: { following: toObjectId(follow) }
      })

      await destroyFollow(toStringId(follow))
    }

    try {
      await deleteImage('categories', get(category, 'image'))
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
