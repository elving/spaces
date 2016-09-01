import get from 'lodash/get'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import differenceBy from 'lodash/differenceBy'

export default space => {
  const products = get(space, 'products', [])
  const spaceCategories = get(space, 'categories', [])
  const spaceTypeCategories = get(space, 'spaceType.categories', [])
  const suggestions = differenceBy(spaceTypeCategories, spaceCategories, 'id')

  return isEmpty(suggestions) && size(products) <= 5
    ? spaceTypeCategories
    : suggestions
}
