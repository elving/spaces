import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/like/getAll'
import create from '../api/like/create'
import search from '../api/like/search'
import destroy from '../api/like/destroy'
import hasLiked from '../api/like/hasLiked'
import updateUser from '../api/user/update'
import toObjectId from '../api/utils/toObjectId'
import updateSpace from '../api/space/updateStats'
import updateProduct from '../api/product/updateStats'

export const like = async (req, res) => {
  const userId = get(req, 'user.id')
  const parent = get(req.body, 'parent', '')
  const createdBy = get(req.body, 'createdBy', '')
  const parentType = get(req.body, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const userHasLiked = await hasLiked(parentType, parent, createdBy)

    if (userHasLiked) {
      res.status(200).json({ success: true })
    } else {
      const newLike = await create(req.body)

      if (isEqual(parentType, 'space')) {
        await updateSpace(parent, {
          $inc: { likesCount: 1 }
        })
      } else {
        await updateProduct(parent, {
          $inc: { likesCount: 1 }
        })
      }

      const user = await updateUser(userId, {
        $addToSet: { likes: toObjectId(newLike) }
      })

      req.logIn(user, () => res.status(200).json(newLike))
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
  const userId = get(req, 'user.id')
  const parent = get(req.params, 'parent', '')
  const createdBy = get(req.params, 'createdBy', '')
  const parentType = get(req.params, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const deletedLike = await destroy(parentType, parent, createdBy)

    if (isEqual(parentType, 'space')) {
      await updateSpace(parent, {
        $inc: { likesCount: -1 }
      })
    } else {
      await updateProduct(parent, {
        $inc: { likesCount: -1 }
      })
    }

    const user = await updateUser(userId, {
      $pull: { likes: toObjectId(deletedLike) }
    })

    req.logIn(user, () => res.status(200).json({ success: true }))
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to unlike ${parentType}.`
      }
    })
  }
}

export const getUserLikes = async (req, res) => {
  const createdBy = get(req.params, 'user', '')

  if (isEmpty(createdBy)) {
    return res.status(200).json({ likes: [] })
  }

  try {
    const likes = await search({ createdBy })
    res.status(200).json(likes)
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch likes from this designer.'
        )
      }
    })
  }
}

export const getSpaceLikes = async (req, res) => {
  const space = get(req.params, 'space', '')

  if (isEmpty(space)) {
    return res.status(200).json({ likes: [] })
  }

  try {
    const likes = await getAll(space)
    res.status(200).json({ likes })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch likes from this space.'
        )
      }
    })
  }
}

export const getProductLikes = async (req, res) => {
  const product = get(req.params, 'product', '')

  if (isEmpty(product)) {
    return res.status(200).json({ likes: [] })
  }

  try {
    const likes = await getAll(product)
    res.status(200).json({ likes })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch likes from this product.'
        )
      }
    })
  }
}
