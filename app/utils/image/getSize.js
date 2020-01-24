import get from 'lodash/get'
import round from 'lodash/round'

export default file => (
  round(get(file, 'size', 0) / 1024)
)
