import get from 'lodash/get'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'

import { default as searchAllUsers } from '../api/user/search'
import { default as searchAllSpaces } from '../api/space/search'
import { default as searchAllProducts } from '../api/product/search'
import { default as searchAllCategories } from '../api/category/search'
import { default as searchAllSpaceTypes } from '../api/spaceType/search'

export const renderSearchResults = async (req, res, next) => {
  let results = []
  const params = get(req, 'query', {})
  const searchType = get(params, 'type')
  const searchParams = omit(params, ['type'])

  res.locals.metadata = {
    title: 'Search Results | Spaces',
    bodyId: 'search-results',
    bodyClass: 'page page-search-results'
  }

  try {
    if (isEqual(searchType, 'products')) {
      results = await searchAllProducts(searchParams)
    } else if (isEqual(searchType, 'spaces')) {
      results = await searchAllSpaces(searchParams)
    } else if (isEqual(searchType, 'designers')) {
      results = await searchAllUsers(searchParams)
    }

    res.locals.props = results
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
