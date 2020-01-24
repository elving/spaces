import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import toStringId from '../../api/utils/toStringId'

export default (user, model) => {
  const userId = toStringId(user)

  return (
    !isEmpty(userId) &&
    userId === toStringId(get(model, 'createdBy'))
  )
}
