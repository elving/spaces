import map from 'lodash/map'
import join from 'lodash/join'

export default categories => (
  `/search/?type=products&categories=${join(map(categories, 'id'), '%2C')}`
)
