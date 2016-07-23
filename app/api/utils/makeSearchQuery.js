import has from 'lodash/has'
import split from 'lodash/split'
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

  if (has(params, 'brand')) {
    query.brand = {
      $regex: params.brand,
      $options: 'i'
    }
  }

  if (has(params, 'brands')) {
    if (isArray(params.brands)) {
      query.brands = { $in: params.brands }
    } else {
      query.brands = { $in: split(params.brands, ',') }
    }
  }

  if (has(params, 'colors')) {
    if (isArray(params.colors)) {
      query.colors = { $in: params.colors }
    } else {
      query.colors = { $in: split(params.colors, ',') }
    }
  }

  if (has(params, 'categories')) {
    if (isArray(params.categories)) {
      query.categories = { $in: params.categories }
    } else {
      query.categories = { $in: split(params.categories, ',') }
    }
  }

  if (has(params, 'spaceTypes')) {
    if (isArray(params.spaceTypes)) {
      query.spaceTypes = { $in: params.spaceTypes }
    } else {
      query.spaceTypes = { $in: split(params.spaceTypes, ',') }
    }
  }

  if (has(params, 'spaceType')) {
    query.spaceType = params.spaceType
  }

  if (has(params, 'createdBy')) {
    if (isArray(params.createdBy)) {
      query.createdBy = { $in: params.createdBy }
    } else {
      query.createdBy = params.createdBy
    }
  }

  return query
}
