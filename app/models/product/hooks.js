import get from 'lodash/get'

import toIds from '../../api/utils/toIds'
import getLikes from '../../api/like/getAll'
import logError from '../../utils/logError'
import toObjectId from '../../api/utils/toObjectId'
import updateUser from '../../api/user/update'
import toStringId from '../../api/utils/toStringId'
import updateRoom from '../../api/spaceType/update'
import destroyLike from '../../api/like/destroyById'
import deleteImage from '../../utils/image/deleteImage'
import updateCategory from '../../api/category/update'
import { removeFromCache, invalidateFromCache } from '../../api/cache'

export default (schema) => {
  schema.pre('save', function(next) {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', async function(product) {
    const id = get(product, 'id')
    const brand = toStringId(get(product, 'brand'))
    const rooms = toIds(get(product, 'spaceTypes', []))
    const colors = toIds(get(product, 'colors'))
    const categories = toIds(get(product, 'categories', []))

    if (this.wasNew) {
      for (const category of categories) {
        await updateCategory(category, {
          $inc: { productsCount: 1 }
        })
      }

      for (const room of rooms) {
        await updateRoom(room, {
          $inc: { productsCount: 1 }
        })
      }

      this.wasNew = false
    }

    if (this.shouldUpdateCategories) {
      try {
        const prevCategories = this.productCategories
        const nextCategories = categories

        for (const prevCategory of prevCategories) {
          await updateCategory(prevCategory, {
            $inc: { productsCount: -1 }
          })
        }

        for (const nextCategory of nextCategories) {
          await updateCategory(nextCategory, {
            $inc: { productsCount: 1 }
          })
        }

        this.productCategories = []
        this.shouldUpdateCategories = false
      } catch (err) {
        logError(err)
      }
    }

    if (product.shouldUpdateRooms) {
      try {
        const prevRooms = this.productRooms
        const nextRooms = rooms

        for (const prevRoom of prevRooms) {
          await updateRoom(prevRoom, {
            $inc: { productsCount: -1 }
          })
        }

        for (const nextRoom of nextRooms) {
          await updateRoom(nextRoom, {
            $inc: { productsCount: 1 }
          })
        }

        this.productRooms = []
        this.shouldUpdateRooms = false
      } catch (err) {
        logError(err)
      }
    }

    await removeFromCache('brand-all')
    await removeFromCache('color-all')
    await removeFromCache('category-all')
    await removeFromCache('spaceType-all')
    await removeFromCache('product-all')
    await removeFromCache('product-latest')
    await removeFromCache('product-popular-8')
    await removeFromCache(`product-related-${id}`)

    await invalidateFromCache([
      id,
      brand,
      rooms,
      colors,
      categories
    ])
  })

  schema.post('findOneAndRemove', async (product) => {
    const id = get(product, 'id')
    const rooms = toIds(get(product, 'spaceTypes', []))
    const brand = toStringId(get(product, 'brand'))
    const colors = toIds(get(product, 'colors', []))
    const categories = toIds(get(product, 'categories', []))
    const usersWhoLiked = []

    try {
      for (const room of (rooms || [])) {
        await updateRoom(room, {
          $inc: { productsCount: -1 }
        })
      }
    } catch (err) {
      logError(err)
    }

    for (const category of (categories || [])) {
      try {
        await updateCategory(category, {
          $inc: { productsCount: -1 }
        })
      } catch (err) {
        logError(err)
      }
    }

    try {
      const likes = await getLikes(id)

      for (const like of (likes || [])) {
        try {
          const user = toStringId(get(like, 'createdBy'))

          usersWhoLiked.push(user)

          await updateUser(user, {
            $pull: { likes: toObjectId(like) }
          })

          await destroyLike(toStringId(like))
        } catch (err) {
          logError(err)
        }
      }
    } catch (err) {
      logError(err)
    }

    try {
      await deleteImage('products', get(product, 'image'))
    } catch (err) {
      logError(err)
    }

    try {
      await removeFromCache('brand-all')
      await removeFromCache('color-all')
      await removeFromCache('category-all')
      await removeFromCache('spaceType-all')
      await removeFromCache('product-all')
      await removeFromCache('product-latest')
      await removeFromCache('product-popular-8')
      await removeFromCache(`product-related-${id}`)

      await invalidateFromCache([
        id,
        rooms,
        brand,
        colors,
        categories,
        usersWhoLiked
      ])
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
