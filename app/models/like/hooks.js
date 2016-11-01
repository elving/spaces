import get from 'lodash/get'

import logError from '../../utils/logError'
import toStringId from '../../api/utils/toStringId'
import toObjectId from '../../api/utils/toObjectId'
import updateUser from '../../api/user/update'
import updateSpace from '../../api/space/updateStats'
import updateComment from '../../api/comment/updateStats'
import updateProduct from '../../api/product/updateStats'

export default schema => {
  schema.pre('save', function(next) {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', async function(like) {
    const parent = toStringId(get(like, 'parent'))
    const createdBy = toStringId(get(like, 'createdBy'))
    const parentType = get(like, 'parentType')

    if (this.wasNew) {
      try {
        if (parentType === 'space') {
          await updateSpace(parent, {
            $inc: { likesCount: 1 }
          })
        } else if (parentType === 'product') {
          await updateProduct(parent, {
            $inc: { likesCount: 1 }
          })
        } else if (parentType === 'comment') {
          await updateComment(parent, {
            $inc: { likesCount: 1 }
          })
        }

        await updateUser(createdBy, {
          $addToSet: { likes: toObjectId(like) }
        })
      } catch (err) {
        logError(err)
      }
    }

    this.wasNew = false
  })

  schema.post('findOneAndRemove', async (like) => {
    const parent = toStringId(get(like, 'parent'))
    const createdBy = toStringId(get(like, 'createdBy'))
    const parentType = get(like, 'parentType')

    try {
      if (parentType === 'space') {
        await updateSpace(parent, {
          $inc: { likesCount: -1 }
        })
      } else if (parentType === 'product') {
        await updateProduct(parent, {
          $inc: { likesCount: -1 }
        })
      } else if (parentType === 'comment') {
        await updateComment(parent, {
          $inc: { likesCount: -1 }
        })
      }

      await updateUser(createdBy, {
        $pull: { likes: toObjectId(like) }
      })
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
