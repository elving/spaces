import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import omit from 'lodash/omit'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import mongoose from 'mongoose'

import isTrue from './isTrue'

export const sanitizeProductProps = (props) => {
  if (isEmpty(props.colors)) {
    props.colors = []
  } else if (isString(props.colors)) {
    props.colors = map(split(props.colors, ','), (id) => (
      mongoose.Types.ObjectId(id)
    ))
  } else if (isArray(props.colors)) {
    props.colors = map(props.colors, (id) => (
      mongoose.Types.ObjectId(id)
    ))
  }

  if (isEmpty(props.categories)) {
    props.categories = []
  } else if (isString(props.categories)) {
    props.categories = map(split(props.categories, ','), (id) => (
      mongoose.Types.ObjectId(id)
    ))
  } else if (isArray(props.categories)) {
    props.categories = map(props.categories, (id) => (
      mongoose.Types.ObjectId(id)
    ))
  }

  if (isEmpty(props.brand)) {
    props.brand = {}
  } else if (isString(props.brand)) {
    props.brand = mongoose.Types.ObjectId(props.brand)
  }

  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.updatedBy) && !isEmpty(props.updatedBy)) {
    props.updatedBy = mongoose.Types.ObjectId(props.updatedBy)
  }

  props.isPublished = isTrue(props.isPublished) ? true : false

  return props
}

export const sanitizeSpaceProps = (props) => {
  if (isEmpty(props.colors)) {
    props.colors = []
  } else if (isString(props.colors)) {
    props.colors = map(split(props.colors, ','), (id) => (
      mongoose.Types.ObjectId(id)
    ))
  } else if (isArray(props.colors)) {
    props.colors = map(props.colors, (id) => (
      mongoose.Types.ObjectId(id)
    ))
  }

  if (isEmpty(props.products)) {
    props.products = []
  } else if (isString(props.products)) {
    props.products = map(split(props.products, ','), (id) => (
      mongoose.Types.ObjectId(id)
    ))
  } else if (isArray(props.products)) {
    props.products = map(props.products, (id) => (
      mongoose.Types.ObjectId(id)
    ))
  }

  if (isEmpty(props.category)) {
    props.category = {}
  } else if (isString(props.category)) {
    props.category = mongoose.Types.ObjectId(props.category)
  }

  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.updatedBy) && !isEmpty(props.updatedBy)) {
    props.updatedBy = mongoose.Types.ObjectId(props.updatedBy)
  }

  props.isPublished = isTrue(props.isPublished) ? true : false

  return props
}

export const sanitizeBrandProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.updatedBy) && !isEmpty(props.updatedBy)) {
    props.updatedBy = mongoose.Types.ObjectId(props.updatedBy)
  }

  props.isPublished = isTrue(props.isPublished) ? true : false

  return props
}

export const sanitizeCategoryProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.updatedBy) && !isEmpty(props.updatedBy)) {
    props.updatedBy = mongoose.Types.ObjectId(props.updatedBy)
  }

  props.isPublished = isTrue(props.isPublished) ? true : false

  return props
}

export const sanitizeColorProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.updatedBy) && !isEmpty(props.updatedBy)) {
    props.updatedBy = mongoose.Types.ObjectId(props.updatedBy)
  }

  props.isPublished = isTrue(props.isPublished) ? true : false

  return props
}

export const sanitizeProductLikeProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.product) && !isEmpty(props.product)) {
    props.product = mongoose.Types.ObjectId(props.product)
  }

  return props
}

export const sanitizeSpaceLikeProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.product) && !isEmpty(props.product)) {
    props.product = mongoose.Types.ObjectId(props.product)
  }

  return props
}

export const sanitizeProductCommentProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.product) && !isEmpty(props.product)) {
    props.product = mongoose.Types.ObjectId(props.product)
  }

  return props
}

export const sanitizeSpaceCommentProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (isString(props.space) && !isEmpty(props.space)) {
    props.space = mongoose.Types.ObjectId(props.space)
  }

  return props
}

export const sanitizeCollectionProps = (props) => {
  if (isString(props.createdBy) && !isEmpty(props.createdBy)) {
    props.createdBy = mongoose.Types.ObjectId(props.createdBy)
  }

  if (!isEmpty(props.products)) {
    props.products = map(props.products, (id) => mongoose.Types.ObjectId(id))
  }

  if (has(props, 'isPublic')) {
    props.isPublic = isTrue(props.isPublic) ? true : false
  }

  return props
}

export const sanitizeUserProps = (props) => {
  if (has(props, 'avatarUrl')) {
    props.avatar = {
      url: get(props, 'avatarUrl'),
      width: get(props, 'avatarWidth'),
      height:  get(props, 'avatarHeight'),
      orientation: get(props, 'avatarOrientation')
    }
  }

  return omit(props, [
    'createdAt', 'updatedAt',
    'avatarUrl', 'avatarWidth', 'avatarHeight', 'avatarOrientation',
    'salt', 'isAdmin', 'hashedPassword', 'confirmPassword'
  ])
}
