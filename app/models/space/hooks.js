import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import toIds from '../../api/utils/toIds'
import update from '../../api/space/update'
import getLikes from '../../api/like/getAll'
import logError from '../../utils/logError'
import findUser from '../../api/user/findById'
import updateUser from '../../api/user/update'
import toObjectId from '../../api/utils/toObjectId'
import toStringId from '../../api/utils/toStringId'
import updateRoom from '../../api/spaceType/update'
import deleteImage from '../../utils/image/deleteImage'
import destroyLike from '../../api/like/destroyById'
import generateImage from '../../utils/image/generateImage'
import updateCategory from '../../api/category/update'
import updateSettings from '../../utils/user/updateSettings'

export default schema => {
  schema.pre('save', function(next) {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', async function(space) {
    const id = get(space, 'id')

    if (this.skipPostSaveHook) {
      this.skipPostSaveHook = false
      return
    }

    const room = toStringId(get(space, 'spaceType'))
    const createdBy = toStringId(get(space, 'createdBy'))
    const categories = toIds(get(space, 'categories', []))

    if (this.wasNew) {
      for (const category of (categories || [])) {
        try {
          await updateCategory(category, {
            $inc: { spacesCount: 1 }
          })
        } catch (err) {
          logError(err)
        }
      }

      try {
        await updateRoom(room, {
          $inc: { spacesCount: 1 }
        })
      } catch (err) {
        logError(err)
      }

      try {
        const user = await findUser(createdBy)
        await updateUser(createdBy, {
          $set: { settings: updateSettings(user, { onboarding: false }) },
          $addToSet: { spaces: toObjectId(space) }
        })
      } catch (err) {
        logError(err)
      }

      this.wasNew = false
    }

    if (this.shouldUpdateCategories) {
      try {
        const prevCategories = categories
        const nextCategories = this.productCategories

        for (const prevCategory of prevCategories) {
          await updateCategory(prevCategory, {
            $inc: { spacesCount: -1 }
          })
        }

        for (const nextCategory of nextCategories) {
          await updateCategory(nextCategory, {
            $inc: { spacesCount: 1 }
          })
        }
      } catch (err) {
        logError(err)
      }

      this.productCategories = []
      this.shouldUpdateCategories = false
    }

    if (this.shouldUpdateImage) {
      const image = await generateImage('spaces', this.productImages)

      try {
        await update(id, { image })
      } catch (err) {
        logError(err)
      }

      this.productImages = []
      this.shouldUpdateImage = false
    }

    this.forcedUpdate = false
  })

  schema.post('findOneAndRemove', async (space) => {
    const id = get(space, 'id')
    const room = toStringId(get(space, 'spaceType'))
    const createdBy = toStringId(get(space, 'createdBy'))
    const categories = toIds(get(space, 'categories', []))
    const originalSpace = toStringId(get(space, 'originalSpace'))
    const usersWhoLiked = []

    try {
      await deleteImage('spaces', get(space, 'image'))
      await deleteImage('spaces', get(space, 'coverImage'))
    } catch (err) {
      logError(err)
    }

    if (!isEmpty(originalSpace)) {
      try {
        await update(originalSpace, {
          $inc: { redesignsCount: -1 },
          $pull: { redesigns: toObjectId(space) }
        })
      } catch (err) {
        logError(err)
      }
    }

    try {
      await updateRoom(room, {
        $inc: { spacesCount: -1 }
      })
    } catch (err) {
      logError(err)
    }

    for (const category of (categories || [])) {
      try {
        await updateCategory(category, {
          $inc: { spacesCount: -1 }
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
      await updateUser(createdBy, {
        $pull: { spaces: toObjectId(space) }
      })
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
