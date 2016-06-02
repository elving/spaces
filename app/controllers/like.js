import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isAuthenticatedUser from '../utils/isAuthenticatedUser'

import create from '../api/like/create'
import destroy from '../api/like/destroy'
import hasLiked from '../api/like/hasLiked'
import updateSpace from '../api/space/update'
import updateProduct from '../api/product/update'

import { default as updateUserLikes } from '../api/user/updateLikes'

export const like = async (req, res) => {
  const parent = get(req.body, 'parent', '')
  const createdBy = get(req.body, 'createdBy', '')
  const parentType = get(req.body, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const userHasLiked = await hasLiked(parentType, parent, createdBy)

    if (userHasLiked) {
      res.status(500).json({
        err: `User: ${createdBy} already likes ${parentType}: ${parent}`
      })
    } else {
      const like = await create(req.body)

      if (isEqual(parentType, 'space')) {
        await updateSpace(parent, {$inc: { likesCount: 1 }}, true)
      } else {
        await updateProduct(parent, {$inc: { likesCount: 1 }}, true)
      }

      await updateUserLikes(req, like)
      res.status(200).json(like)
    }
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to like ${parentType}.`
      }
    })
  }
}

export const unlike = async (req, res) => {
  const parent = get(req.params, 'parent', '')
  const createdBy = get(req.params, 'createdBy', '')
  const parentType = get(req.params, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const like = await destroy(parentType, parent, createdBy)

    if (isEqual(parentType, 'space')) {
      await updateSpace(parent, {$inc: { likesCount: -1 }}, true)
    } else {
      await updateProduct(parent, {$inc: { likesCount: -1 }}, true)
    }

    await updateUserLikes(req, like, 'remove')
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to unlike ${parentType}.`
      }
    })
  }
}
