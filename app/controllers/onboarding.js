import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import concat from 'lodash/concat'

import toJSON from '../api/utils/toJSON'
import setProps from '../utils/middlewares/setProps'
import setMetadata from '../utils/middlewares/setMetadata'
import withoutAnyType from '../utils/spaceType/withoutAnyType'
import isAuthenticatedUser from '../utils/user/isAuthenticatedUser'
import { default as searchCategories } from '../api/category/search'
import { default as searchSpaceTypes } from '../api/spaceType/search'

export const renderOnboarding = async (req, res, next) => {
  if (!isAuthenticatedUser(req.user)) {
    return res.redirect('/login/')
  }

  try {
    const categories = await searchCategories({ limit: 1000 })
    const spaceTypes = await searchSpaceTypes({ limit: 1000 })

    const interests = concat(
      [],
      get(toJSON(categories), 'results', []),
      withoutAnyType(get(toJSON(spaceTypes), 'results', []))
    )

    setMetadata(res, {
      title: 'Onboarding | Spaces',
      bodyId: 'onboarding',
      bodyClass: 'page page-onboarding'
    })

    setProps(res, {
      interests: sortBy(interests, 'name')
    })

    next()
  } catch (err) {
    next(err)
  }
}
