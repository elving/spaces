import get from 'lodash/get'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import toJSON from '../api/utils/toJSON'
import isAdmin from '../utils/user/isAdmin'
import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'

import find from '../api/guide/find'
import getAll from '../api/guide/getAll'
import create from '../api/guide/create'
import update from '../api/guide/update'
import destroy from '../api/guide/destroy'
import getGuide from '../api/guide/get'

export const renderIndex = async (req, res, next) => {
  try {
    setOgTags(req, res, {
      ogTitle: 'Shopping guides for your home curated by people like you.'
    })

    setMetadata(res, {
      title: 'Shopping Guides | Spaces',
      bodyId: 'all-guides',
      bodyClass: 'page page-all-guides'
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderDetail = async (req, res, next) => {
  if (get(req, 'params.name') === 'update') {
    return next()
  }

  const sid = get(req, 'params.sid')

  try {
    const guide = await find(sid)

    if (
      isEmpty(guide) ||
      (!get(guide, 'isPublished', false) && !isAdmin(req.user))
    ) {
      return res.redirect('/404/')
    }

    const name = get(guide, 'name')
    const description = get(guide, 'description')

    setOgTags(req, res, {
      ogTitle: name,
      ogDescription: description
    })

    setMetadata(res, {
      title: `${name} | Spaces`,
      bodyId: 'page-guide-detail',
      bodyClass: 'page'
    })

    setProps(res, guide)
    next()
  } catch (err) {
    next(err)
  }
}

export const renderAdminGuides = async (req, res, next) => {
  try {
    setMetadata(res, {
      title: 'All Guides | Spaces',
      bodyId: 'all-guides',
      bodyClass: 'page page-all-guides page-admin-table'
    })

    const guides = await getAll()

    setProps(res, { guides: toJSON(guides) })
    next()
  } catch (err) {
    next(err)
  }
}

export const renderAddGuide = async (req, res, next) => {
  try {
    setMetadata(res, {
      title: 'Add Guide | Spaces',
      bodyId: 'add-guide',
      bodyClass: 'page page-add-guide'
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const addGuide = async (req, res) => {
  if (!isAdmin(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const guide = await create(
      merge(req.body, {
        createdBy: get(req, 'user.id'),
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(guide)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const renderUpdateGuide = async (req, res, next) => {
  const sid = get(req, 'params.sid')

  if (!isAdmin(req.user)) {
    return res.redirect('/404/')
  }

  if (isEqual(sid, 'add') || isEmpty(sid)) {
    next()
  }

  try {
    const guide = await getGuide(sid)

    if (isEmpty(guide)) {
      return res.redirect('/404/')
    }

    setMetadata(res, {
      title: 'Update Guide | Spaces',
      bodyId: 'update-guide',
      bodyClass: 'page page-update-guide page-crud-guide'
    })

    setProps(res, {
      guide: toJSON(guide)
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const updateGuide = async (req, res) => {
  const id = get(req, 'params.id')

  if (!isAuthenticatedUser(req.user)) {
    res.status(500).json({
      err: {
        generic: 'Not authorized'
      }
    })
  }

  try {
    const guide = await update(
      id, merge(req.body, {
        updatedBy: get(req, 'user.id')
      })
    )

    res.status(200).json(guide)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const destroyGuide = async (req, res) => {
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
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}
