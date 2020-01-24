import isEmpty from 'lodash/isEmpty'

import create from './create'
import findByName from './findByName'

export default (name, returnDocument = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const brand = await findByName(name, returnDocument)

      if (!isEmpty(brand)) {
        return resolve(brand)
      } else {
        try {
          const newBrand = await create({ name })
          return resolve(newBrand)
        } catch (err) {
          return reject(err)
        }
      }
    } catch(err) {
      return reject(err)
    }
  })
}
