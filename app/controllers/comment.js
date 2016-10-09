import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import getAll from '../api/comment/getAll'
import create from '../api/comment/create'
import destroy from '../api/comment/destroy'

export const postComment = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    const comment = await create(req.body)
    res.status(200).json(comment)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const deleteComment = async (req, res) => {
  const id = get(req.params, 'id', '')

  if (!isAuthenticatedUser(req.user)) {
    return res.status(500).json({
      err: { generic: 'Not authorized' }
    })
  }

  try {
    await destroy(id)
    res.status(200).json({ success: true })
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

export const getProductComments = async (req, res) => {
  const product = get(req.params, 'product', '')

  if (isEmpty(product)) {
    return res.status(200).json({ comments: [] })
  }

  try {
    const comments = await getAll(product)
    res.status(200).json({ comments })
  } catch (err) {
    res.status(500).json({
      err: {
        genereic: (
          'There was an error while trying to fetch comments from this product.'
        )
      }
    })
  }
}
