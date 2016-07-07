import has from 'lodash/has'
import get from 'lodash/get'
import split from 'lodash/split'

export default (params = {}) => {
  const query = {}

  if (has(params, 'name')) {
    query.name = {
      $regex: get(params, 'name', ''),
      $options: 'i'
    }
  }

  if (has(params, 'username')) {
    query.username = {
      $regex: get(params, 'username', ''),
      $options: 'i'
    }
  }

  if (has(params, 'brands')) {
    query.brand = {
      $in: split(
        get(params, 'brands', []), ','
      )
    }
  }

  if (has(params, 'colors')) {
    query.colors = {
      $in: split(
        get(params, 'colors', []), ','
      )
    }
  }

  if (has(params, 'categories')) {
    query.categories = {
      $in: split(
        get(params, 'categories', []), ','
      )
    }
  }

  if (has(params, 'spaceTypes')) {
    query.spaceTypes = {
      $in: split(
        get(params, 'spaceTypes', []), ','
      )
    }
  }

  return query
}
