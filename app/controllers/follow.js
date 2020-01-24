import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import search from '../api/follow/search'
import getAll from '../api/follow/getAll'
import create from '../api/follow/create'
import destroy from '../api/follow/destroy'
import hasLiked from '../api/follow/hasLiked'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

export const follow = async (req, res) => {
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
      res.status(200).json(newFollow)
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
  const parent = get(req.params, 'parent', '')
  const createdBy = get(req.params, 'createdBy', '')
  const parentType = get(req.params, 'parentType', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    await destroy(parentType, parent, createdBy)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: `There was an error while trying to unfollow ${parentType}.`
      }
    })
  }
}

export const getUserFollowers = async (req, res) => {
  const createdBy = get(req.params, 'user', '')

  if (isEmpty(createdBy)) {
    return res.status(200).json({ followers: [] })
  }

  try {
    const followers = await search({ createdBy })
    res.status(200).json(followers)
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch followers of this user.'
        )
      }
    })
  }
}

export const getRoomFollowers = async (req, res) => {
  const room = get(req.params, 'room', '')

  if (isEmpty(room)) {
    return res.status(200).json({ followers: [] })
  }

  try {
    const followers = await getAll(room)
    res.status(200).json({ followers })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch followers of this room.'
        )
      }
    })
  }
}

export const getCategoryFollowers = async (req, res) => {
  const category = get(req.params, 'category', '')

  if (isEmpty(category)) {
    return res.status(200).json({ followers: [] })
  }

  try {
    const followers = await getAll(category)
    res.status(200).json({ followers })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch followers of this category.'
        )
      }
    })
  }
}
