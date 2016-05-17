import isEmpty from 'lodash/isEmpty'

import create from './create'
import findByName from './findByName'

export default (name, returnDocument = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spaceType = await findByName(name, returnDocument)

      if (!isEmpty(spaceType)) {
        return resolve(spaceType)
      } else {
        try {
          const newSpaceType = await create({ name })
          return resolve(newSpaceType)
        } catch (err) {
          return reject(err)
        }
      }
    } catch(err) {
      return reject(err)
    }
  })
}
