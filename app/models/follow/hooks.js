import get from 'lodash/get'
import startCase from 'lodash/startCase'

import logError from '../../utils/logError'
import toStringId from '../../api/utils/toStringId'
import toObjectId from '../../api/utils/toObjectId'
import updateUser from '../../api/user/update'
import updateSpace from '../../api/space/updateStats'
import updateProduct from '../../api/product/updateStats'
import updateCategory from '../../api/category/update'
import updateSpaceType from '../../api/spaceType/update'
import createNotification from '../../api/notification/create'

export default schema => {
  schema.pre('save', function(next) {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', async function(follow) {
    const parent = toStringId(get(follow, 'parent'))
    const createdBy = toStringId(get(follow, 'createdBy'))
    const parentType = get(follow, 'parentType')

    if (this.wasNew) {
      try {
        if (parentType === 'space') {
          await updateSpace(parent, {
            $inc: { followersCount: 1 }
          })
        } else if (parentType === 'product') {
          await updateProduct(parent, {
            $inc: { followersCount: 1 }
          })
        } else if (parentType === 'category') {
          await updateCategory(parent, {
            $inc: { followersCount: 1 }
          })
        } else if (parentType === 'spaceType') {
          await updateSpaceType(parent, {
            $inc: { followersCount: 1 }
          })
        } else if (parentType === 'user') {
          await updateUser(parent, {
            $inc: { followersCount: 1 }
          })
        }

        await updateUser(createdBy, {
          $addToSet: { following: toObjectId(follow) }
        })

        if (parentType === 'user') {
          this.populate({
            path: 'parent',
            model: startCase(parentType),
            select: 'createdBy'
          }, async (err, _follow) => {
            if (err) {
              return logError(err)
            }

            await createNotification({
              action: 'follow',
              context: parent,
              recipient: toStringId(get(_follow, 'parent')),
              createdBy,
              contextType: parentType
            })
          })
        }
      } catch (err) {
        logError(err)
      }
    }

    this.wasNew = false
  })

  schema.post('findOneAndRemove', async (follow) => {
    const parent = toStringId(get(follow, 'parent'))
    const createdBy = toStringId(get(follow, 'createdBy'))
    const parentType = get(follow, 'parentType')

    try {
      if (parentType === 'space') {
        await updateSpace(parent, {
          $inc: { followersCount: -1 }
        })
      } else if (parentType === 'product') {
        await updateProduct(parent, {
          $inc: { followersCount: -1 }
        })
      } else if (parentType === 'category') {
        await updateCategory(parent, {
          $inc: { followersCount: -1 }
        })
      } else if (parentType === 'spaceType') {
        await updateSpaceType(parent, {
          $inc: { followersCount: -1 }
        })
      } else if (parentType === 'user') {
        await updateUser(parent, {
          $inc: { followersCount: -1 }
        })
      }

      await updateUser(createdBy, {
        $pull: { following: toObjectId(follow) }
      })
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
