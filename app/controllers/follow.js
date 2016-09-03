import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import getAll from '../api/follow/getAll'
import create from '../api/follow/create'
import destroy from '../api/follow/destroy'
import hasLiked from '../api/follow/hasLiked'
import toObjectId from '../api/utils/toObjectId'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import { default as updateUser } from '../api/user/update'
import { default as updateSpace } from '../api/space/update'
import { default as updateProduct } from '../api/product/update'
import { default as updateCategory } from '../api/category/update'
import { default as updateSpaceType } from '../api/spaceType/update'

export const follow = async (req, res) => {
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
      const newFollow = await create(req.body)

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

      const user = await updateUser(userId, {
        $addToSet: { following: toObjectId(newFollow) }
      })

      req.logIn(user, () => res.status(200).json(newFollow))
    }
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to follow ${parentType}.`
      }
    })
  }
}

export const unfollow = async (req, res) => {
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
    const deletedFollow = await destroy(parentType, parent, createdBy)

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

    const user = await updateUser(userId, {
      $pull: { following: toObjectId(deletedFollow) }
    })

    req.logIn(user, () => res.status(200).json({ success: true }))
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to unfollow ${parentType}.`
      }
    })
  }
}

export const getSpaceLikes = async (req, res) => {
  const space = get(req.params, 'space', '')

  if (isEmpty(space)) {
    return res.status(200).json({ follows: [] })
  }

  try {
    const follows = await getAll(space)
    res.status(200).json({ follows })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch follows from this space.'
        )
      }
    })
  }
}
