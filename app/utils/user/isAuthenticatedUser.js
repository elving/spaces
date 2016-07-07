import isEmpty from 'lodash/isEmpty'

import toStringId from '../../api/utils/toStringId'

export default (user) => !isEmpty(user) && !isEmpty(toStringId(user))
