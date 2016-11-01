import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/like/getAll'
import create from '../api/like/create'
import search from '../api/like/search'
import destroy from '../api/like/destroy'
import hasLiked from '../api/like/hasLiked'

export const like = async (req, res) => {
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
      res.status(200).json(newLike)
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
      err: { generic: 'Not authorized' }
    })
  }

  try {
    await destroy(parentType, parent, createdBy)
    res.status(200).json({ success: true })
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

export const getCommentLikes = async (req, res) => {
  const comment = get(req.params, 'comment', '')

  if (isEmpty(comment)) {
    return res.status(200).json({ likes: [] })
  }

  try {
    const likes = await getAll(comment)
    res.status(200).json({ likes })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch likes from this comment.'
        )
      }
    })
  }
}
