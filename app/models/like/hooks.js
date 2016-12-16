import get from 'lodash/get'
import startCase from 'lodash/startCase'

import logError from '../../utils/logError'
import toStringId from '../../api/utils/toStringId'
import toObjectId from '../../api/utils/toObjectId'
import updateUser from '../../api/user/update'
import updateSpace from '../../api/space/updateStats'
import updateGuide from '../../api/guide/updateStats'
import updateComment from '../../api/comment/updateStats'
import updateProduct from '../../api/product/updateStats'
import createNotification from '../../api/notification/create'

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
        } else if (parentType === 'guide') {
          await updateGuide(parent, {
            $inc: { likesCount: 1 }
          })
        }

        await updateUser(createdBy, {
          $addToSet: { likes: toObjectId(like) }
        })

        this.populate({
          path: 'parent',
          model: startCase(parentType),
          select: 'createdBy'
        }, async (err, _like) => {
          if (err) {
            return logError(err)
          }

          const recipient = toStringId(get(_like, 'parent.createdBy'))

          if (recipient !== createdBy) {
            await createNotification({
              action: 'like',
              context: parent,
              recipient,
              createdBy,
              contextType: parentType
            })
          }
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
      } else if (parentType === 'guide') {
        await updateGuide(parent, {
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
