import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/comment/getAll'
import create from '../api/comment/create'
import destroy from '../api/comment/destroy'
import updateUser from '../api/user/update'
import updateSpace from '../api/space/update'
import updateProduct from '../api/product/update'

import { toObjectId } from '../api/utils'

export const comment = async (req, res) => {
  const userId = get(req, 'user.id')
  const parent = get(req.body, 'parent', '')
  const parentType = get(req.body, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const comment = await create(req.body)

    if (isEqual(parentType, 'space')) {
      await updateSpace(parent, {
        $inc: { commentsCount: 1 }
      })
    } else {
      await updateProduct(parent, {
        $inc: { commentsCount: 1 }
      })
    }

    const user = await updateUser(userId, {
      $addToSet: { comments: toObjectId(comment) }
    })

    req.login(user, () => res.status(200).json(comment))
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const deleteComment = async (req, res) => {
  const id = get(req.params, 'id', '')
  const userId = get(req, 'user.id')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const comment = await destroy(id)

    if (isEqual(get(comment, 'parentType'), 'space')) {
      await updateSpace(get(comment, 'parent'), {
        $inc: { commentsCount: -1 }
      })
    } else {
      await updateProduct(get(comment, 'parent'), {
        $inc: { commentsCount: -1 }
      })
    }

    const user = await updateUser(userId, {
      $pull: { comments: toObjectId(comment) }
    })

    req.login(user, () => res.status(200).json({ success: true }))
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: 'There was an error while trying to delete this comment.'
      }
    })
  }
}

export const getSpaceComments = async (req, res) => {
  const space = get(req.params, 'space', '')

  if (isEmpty(space)) {
    return res.status(200).json({ comments: [] })
  }

  try {
    const comments = await getAll(space)
    res.status(200).json({ comments })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch comments from this space.'
        )
      }
    })
  }
}
