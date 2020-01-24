import get from 'lodash/get'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import reduce from 'lodash/reduce'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import compact from 'lodash/compact'

import toStringId from '../../api/utils/toStringId'

export default products => (
  reduce(products, (tags, product) => (
    assign({}, tags, {
      brands: uniq(
        map(
          compact(
            concat(
              get(tags, 'brands', []), get(product, 'brand', '')
            )
          ), toStringId
        )
      ),
      colors: uniq(
        map(
          compact(
            concat(
              get(tags, 'colors', []), get(product, 'colors', [])
            )
          ), toStringId
        )
      ),
      categories: uniq(
        map(
          compact(
            concat(
              get(tags, 'categories', []), get(product, 'categories', [])
            )
          ), toStringId
        )
      )
    })
  ), {})
)
