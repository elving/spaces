import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'

export default params => has(params, 'id') && isEmpty(params.id)
