import get from 'lodash/get'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'

import setProps from '../utils/middlewares/setProps'
import setOgTags from '../utils/middlewares/setOgTags'
import setMetadata from '../utils/middlewares/setMetadata'

import searchAllUsers from '../api/user/search'
import searchAllSpaces from '../api/space/search'
import searchAllGuides from '../api/guide/search'
import getSearchFilters from '../api/common/getSearchFilters'
import searchAllFollows from '../api/follow/search'
import searchAllProducts from '../api/product/search'
import searchAllCategories from '../api/category/search'
import searchAllSpaceTypes from '../api/spaceType/search'

export const renderSearchResults = async (req, res, next) => {
  let results = []
  const params = get(req, 'query', {})
  const searchType = get(params, 'type')
  const searchParams = omit(params, ['type'])

  try {
    const filters = await getSearchFilters()

    if (isEqual(searchType, 'guides')) {
      results = await searchAllGuides(searchParams)
    } else if (isEqual(searchType, 'products')) {
      results = await searchAllProducts(searchParams)
    } else if (isEqual(searchType, 'spaces')) {
      results = await searchAllSpaces(searchParams)
    } else if (isEqual(searchType, 'users')) {
      results = await searchAllUsers(searchParams)
    }

    const count = get(results, 'count', 'Some')

    setOgTags(req, res, {
      ogTitle: `${count} of the best ${searchType} on Spaces.`
    })

    setMetadata(res, {
      title: 'Search Results | Spaces',
      bodyId: 'search-results',
      bodyClass: 'page page-search-results'
    })

    setProps(res, {
      filters,
      ...results
    })

    next()
  } catch (err) {
    next(err)
  }
}

export const renderFinder = async (req, res, next) => {
  try {
    const filters = await getSearchFilters()

    setOgTags(req, res, {
      ogTitle: 'Find the perfect product for your home.'
    })

    setMetadata(res, {
      title: 'Product Finder | Spaces',
      bodyId: 'finder',
      bodyClass: 'page page-finder',
      description: 'Find the perfect product for your home.'
    })

    setProps(res, { filters })

    next()
  } catch (err) {
    next(err)
  }
}

export const searchSpaceTypes = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllSpaceTypes(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchUsers = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllUsers(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchSpaces = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllSpaces(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchFollows = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllFollows(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchProducts = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllProducts(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchCategories = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllCategories(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const searchGuides = async (req, res) => {
  const params = get(req, 'query', {})

  try {
    const results = await searchAllGuides(params)
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ err })
  }
}
