const getPlural = (type) => {
  switch (type) {
    case 'brand': {
      return 'brands'
    }

    case 'category': {
      return 'categories'
    }

    case 'color': {
      return 'colors'
    }

    case 'product': {
      return 'products'
    }

    case 'space': {
      return 'spaces'
    }

    default: {
      return null
    }
  }
}

export const getAdminEditUrl = (model) => {
  let plural = getPlural(model.type)

  if (plural && model.id) {
    return `/admin/${plural}/${model.id}/`
  } else if (plural) {
    return `/admin/${plural}/`
  } else {
    return '/admin/'
  }
}

export const getAdminCreateUrl = (model) => {
  let plural = getPlural(model.type)

  if (plural) {
    return `/admin/${plural}/new/`
  } else {
    return '/admin/'
  }
}
