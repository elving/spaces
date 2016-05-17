import isEmpty from 'lodash/isEmpty'

import create from './create'
import findByName from './findByName'

export default (name, returnDocument = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const color = await findByName(name, returnDocument)

      if (!isEmpty(color)) {
        return resolve(color)
      } else {
        try {
          const newColor = await create({ name })
          return resolve(newColor)
        } catch (err) {
          return reject(err)
        }
      }
    } catch(err) {
      return reject(err)
    }
  })
}
