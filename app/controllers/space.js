import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'

import isAdmin from '../utils/user/isAdmin'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import search from '../api/space/search'
import create from '../api/space/create'
import update from '../api/space/update'
import destroy from '../api/space/destroy'
import findById from '../api/space/findById'
import findBySid from '../api/space/findBySid'

import toJSON from '../api/utils/toJSON'
import toStringId from '../api/utils/toStringId'
import toObjectId from '../api/utils/toObjectId'
import getAllUserSpaces from '../api/user/getSpaces'

export const renderIndex = async (req, res, next) => {
  try {
    setOgTags(req, res, {
      ogTitle: (
        'Get inspired by the most beautiful spaces, ' +
        'designed by our curators.'
      )
    })

    setMetadata(res, {
      title: 'Discover Spaces | Spaces',
      bodyId: 'all-spaces',
      bodyClass: 'page page-all-spaces'
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  try {
    const space = await findBySid(sid)

    if (isEmpty(space)) {
      return res.redirect('/404/')
    }

    const otherSpacesInRoom = await search({
      id: { $nin: [toStringId(space)] },
      limit: 8,
      spaceType: toStringId(get(space, 'spaceType'))
    })

    const name = get(space, 'name')
    const image = get(space, 'image')
    const username = get(space, 'createdBy.username')
    const products = size(get(space, 'products', [])) || ''
    const spaceType = get(space, 'spaceType.name')
    const description = get(space, 'description')

    setOgTags(req, res, {
      ogTitle: (
        `${name} — A space featuring ${products} beautiful ` +
        `products for your ${toLower(spaceType)}`
      ),
      ogImage: image,
      ogDescription: description || `Designed by @${username}`
    })

    setMetadata(res, {
      title: `${get(space, 'name', '')} | Spaces`,
      bodyId: 'space-detail',
      bodyClass: 'page page-space-detail'
    })

    setProps(res, {
      space: toJSON(space),
      otherSpacesInRoom: toJSON(
        get(otherSpacesInRoom, 'results', [])
      )
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const getUserSpaces = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const spaces = await getAllUserSpaces(id)
    res.status(200).json({ spaces })
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const createSpace = async (req, res) => {
  const userId = get(req, 'user.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    let user

    const space = await create(
      merge(req.body, {
        createdBy: userId,
        updatedBy: userId
      })
    )

    res.status(200).json(space)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderCreateSpace = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  setMetadata(res, {
    title: 'Create Space | Spaces',
    bodyId: 'create-space',
    bodyClass: 'page page-create-space'
  })

  next()
}

export const updateSpace = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: { genereic: 'Not authorized' }
    })
  }

  try {
    const space = await update(
      id, merge(req.body, {
        updatedBy: get(req, 'user.id'),
        forcedUpdate: isAdmin(get(req, 'user'))
      })
    )

    res.status(200).json(space)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const redesignSpace = async (req, res) => {
  const userId = get(req, 'user.id')
  const spaceId = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        genereic: 'Not authorized'
      }
    })
  }

  try {
    const originalSpace = await findById(spaceId)
    const originalSpaceProps = toJSON(originalSpace)

    const space = await create(
      merge(req.body, {
        image: get(originalSpaceProps, 'image', ''),
        products: get(originalSpaceProps, 'products', []),
        spaceType: get(originalSpaceProps, 'spaceType', {}),
        createdBy: userId,
        updatedBy: userId
      })
    )

    await update(spaceId, {
      $inc: { redesignsCount: 1 },
      $addToSet: { redesigns: toObjectId(space) }
    })

    res.status(200).json(space)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroySpace = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    await destroy(id)

    res.status(200).json({
      success: true
    })
  } catch (err) {
    res.status(500).json({
      err
    })
  }
}
