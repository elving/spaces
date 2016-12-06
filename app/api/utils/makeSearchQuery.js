import has from 'lodash/has'
import split from 'lodash/split'
import compact from 'lodash/compact'
import isArray from 'lodash/isArray'

export default (params = {}) => {
  const query = {}

  if (has(params, 'name')) {
    query.name = {
      $regex: params.name,
      $options: 'i'
    }
  }

  if (has(params, 'username')) {
    query.username = {
      $regex: params.username,
      $options: 'i'
    }
  }

  if (has(params, 'brandName')) {
    query.brand = {
      $regex: params.brandName,
      $options: 'i'
    }
  }

  if (has(params, 'brands')) {
    if (isArray(params.brands)) {
      query.brands = { $in: compact(params.brands) }
    } else {
      query.brands = { $in: compact(split(params.brands, ',')) }
    }
  }

  if (has(params, 'colors')) {
    if (isArray(params.colors)) {
      query.colors = { $in: compact(params.colors) }
    } else {
      query.colors = { $in: compact(split(params.colors, ',')) }
    }
  }

  if (has(params, 'categories')) {
    if (isArray(params.categories)) {
      query.categories = { $in: compact(params.categories) }
    } else {
      query.categories = { $in: compact(split(params.categories, ',')) }
    }
  }

  if (has(params, 'spaceTypes')) {
    if (isArray(params.spaceTypes)) {
      query.spaceTypes = { $in: compact(params.spaceTypes) }
    } else {
      query.spaceTypes = { $in: compact(split(params.spaceTypes, ',')) }
    }
  }

  if (has(params, 'brand')) {
    query.brand = params.brand
  }

  if (has(params, 'spaceType')) {
    query.spaceType = params.spaceType
  }

  if (has(params, 'originalSpace')) {
    query.originalSpace = params.originalSpace
  }

  if (has(params, 'parent')) {
    query.parent = params.parent
  }

  if (has(params, 'createdBy')) {
    if (isArray(params.createdBy)) {
      query.createdBy = { $in: compact(params.createdBy) }
    } else {
      query.createdBy = params.createdBy
    }
  }

  if (has(params, 'id')) {
    if (isArray(params.id)) {
      query._id = { $in: compact(params.id) }
    } else {
      query._id = params.id
    }
  }

  if (has(params, 'not')) {
    query[params.not[0]] = {
      $nin: [params.not[1]]
    }
  }

  if (has(params, 'usernames')) {
    if (isArray(params.usernames)) {
      query.username = { $in: compact(params.usernames) }
    } else {
      query.username = { $in: compact(split(params.usernames, ',')) }
    }
  }

  return query
}
