import get from 'lodash/get'

import logError from '../../utils/logError'
import toStringId from '../../api/utils/toStringId'
import toObjectId from '../../api/utils/toObjectId'
import updateUser from '../../api/user/update'
import updateSpace from '../../api/space/updateStats'
import updateProduct from '../../api/product/updateStats'

export default schema => {
  schema.pre('save', function(next) {
    this.wasNew = this.isNew
    next()
  })

  schema.post('save', async function(comment) {
    const parent = toStringId(get(comment, 'parent'))
    const createdBy = toStringId(get(comment, 'createdBy'))
    const parentType = get(comment, 'parentType')

    if (this.wasNew) {
      try {
        if (parentType === 'space') {
          await updateSpace(parent, {
            $inc: { commentsCount: 1 }
          })
        } else {
          await updateProduct(parent, {
            $inc: { commentsCount: 1 }
          })
        }

        await updateUser(createdBy, {
          $addToSet: { comments: toObjectId(comment) }
        })
      } catch (err) {
        logError(err)
      }
    }

    this.wasNew = false
  })

  schema.post('findOneAndRemove', async (comment) => {
    const parent = toStringId(get(comment, 'parent'))
    const createdBy = toStringId(get(comment, 'createdBy'))
    const parentType = get(comment, 'parentType')

    try {
      if (parentType === 'space') {
        await updateSpace(parent, {
          $inc: { commentsCount: -1 }
        })
      } else {
        await updateProduct(parent, {
          $inc: { commentsCount: -1 }
        })
      }

      await updateUser(createdBy, {
        $pull: { comments: toObjectId(comment) }
      })
    } catch (err) {
      logError(err)
    }
  })

  return schema
}
