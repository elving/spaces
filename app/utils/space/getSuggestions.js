import get from 'lodash/get'
import differenceBy from 'lodash/differenceBy'

export default space => {
  const spaceCategories = get(space, 'categories', [])
  const spaceTypeCategories = get(space, 'spaceType.categories', [])
  return differenceBy(spaceTypeCategories, spaceCategories, 'id')
}
