import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import metadata from '../constants/metadata'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import search from '../api/spaceType/search'
import getAll from '../api/spaceType/getAll'
import create from '../api/spaceType/create'
import update from '../api/spaceType/update'
import destroy from '../api/spaceType/destroy'
import findBySid from '../api/spaceType/findBySid'
import findByName from '../api/spaceType/findByName'

import getAllCategories from '../api/category/getAll'

export const renderIndex = async (req, res, next) => {
  const description = (`
    Shop beautiful and useful products from
    around the web by rooms — ${metadata.shortDescription}
  `)

  try {
    setOgTags(req, res, {
      ogTitle: description
    })

    setMetadata(res, {
      title: 'Discover Rooms | Spaces',
      bodyId: 'all-rooms',
      bodyClass: 'page page-all-rooms',
      description
    })

    setProps(res, await search({ limit: 1000 }))

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  const slug = get(req, 'params.slug')

  try {
    const spaceType = await findByName(slug)

    const description = (`
      Popular products for
      your ${get(spaceType, 'name')} — ${metadata.shortDescription}
    `)

    if (isEmpty(spaceType)) {
      return res.redirect('/404/')
    }

    setOgTags(req, res, {
      ogTitle: description,
      ogImage: get(spaceType, 'image')
    })

    setMetadata(res, {
      title: `${get(spaceType, 'name')} | Spaces`,
      bodyId: 'page-spaceType-detail',
      bodyClass: 'page page-spaceType-detail',
      description
    })

    setProps(res, {
      spaceType: toJSON(spaceType)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAllSpaceTypes = async (req, res, next) => {
  try {
    const spaceTypes = await getAll()

    setMetadata(res, {
      title: 'All SapceTypes | Spaces',
      bodyId: 'all-spaceTypes',
      bodyClass: 'page page-all-spaceTypes page-admin-table'
    })

    setProps(res, {
      spaceTypes: toJSON(spaceTypes)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddSpaceType = async (req, res, next) => {
  try {
    const categories = await getAllCategories()

    if (!isAuthenticatedUser(req.user)) {
      return res.redirect('/404/')
    }

    setMetadata(res, {
      title: 'Add SpaceType | Spaces',
      bodyId: 'add-spaceType',
      bodyClass: 'page page-add-spaceType page-crud-spaceType'
    })

    setProps(res, {
      categories: toJSON(categories)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const addSpaceType = async (req, res) => {
  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const spaceType = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(spaceType)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateSpaceType = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const spaceType = await findBySid(sid)
    const categories = await getAllCategories()

    setMetadata(res, {
      title: 'Update SpaceType | Spaces',
      bodyId: 'update-spaceType',
      bodyClass: 'page page-update-spaceType page-crud-spaceType'
    })

    setProps(res, {
      spaceType: toJSON(spaceType),
      categories: toJSON(categories)
    })

    if (isEmpty(spaceType)) {
      res.redirect('/404/')
    }

    next()
  } catch (err) {
    res.redirect('/500/')
  }
}

export const updateSpaceType = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const spaceType = await update(sid, req.body)
    res.status(200).json(spaceType)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroySpaceType = async (req, res) => {
  const sid = get(req, 'params.sid')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    await destroy(sid)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}
