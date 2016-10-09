import get from 'lodash/get'
import without from 'lodash/without'

import logError from '../../utils/logError'
import setImage from '../../api/spaceType/setImage'
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
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default (schema) => {
  schema.post('save', async (room) => {
    try {
      await removeFromCache('spaceType-all')
      await removeFromCache('spaceType-popular-8')
      await invalidateFromCache(toStringId(room))
    } catch (err) {
      logError(err)
    }
  })

  schema.post('findOneAndUpdate', async (room) => {
    try {
      await setImage(room)
    } catch (err) {
      logError(err)
    }
  })

  schema.post('findOneAndRemove', async (room) => {
    const id = toStringId(room)

    const products = await getProducts({
      spaceTypes: [id]
    })

    for (const product of products) {
      const productId = toStringId(product)
      const productSpaceTypes = get(product, 'spaceTypes', [])

      await updateProduct(productId, {
        spaceTypes: without(productSpaceTypes, id)
      })
    }

    const spaces = await getSpaces({
      spaceType: id
    })

    for (const space of spaces) {
      const spaceId = toStringId(space)

      await updateSpace(spaceId, {
        spaceType: null
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
      await deleteImage('spaceTypes', get(room, 'image'))
    } catch (err) {
      logError(err)
    }

    try {
      await removeFromCache('spaceType-all')
      await removeFromCache('spaceType-popular-8')
      await invalidateFromCache(id)
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
