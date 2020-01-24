import get from 'lodash/get'
import map from 'lodash/map'
import compact from 'lodash/compact'

export default (products = []) => (
  compact(map(products, product => get(product, 'image')))
)
