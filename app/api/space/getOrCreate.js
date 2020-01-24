import isEmpty from 'lodash/isEmpty'

import create from './create'
import findByName from './findByName'

export default (name, returnDocument = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const space = await findByName(name, returnDocument)

      if (!isEmpty(space)) {
        return resolve(space)
      } else {
        try {
          const newSpace = await create({ name })
          return resolve(newSpace)
        } catch (err) {
          return reject(err)
        }
      }
    } catch(err) {
      return reject(err)
    }
  })
}
