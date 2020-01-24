import isEmpty from 'lodash/isEmpty'

import create from './create'
import findByName from './findByName'

export default (name, returnDocument = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await findByName(name, returnDocument)

      if (!isEmpty(category)) {
        return resolve(category)
      } else {
        try {
          const newCategory = await create({ name })
          return resolve(newCategory)
        } catch (err) {
          return reject(err)
        }
      }
    } catch(err) {
      return reject(err)
    }
  })
}
