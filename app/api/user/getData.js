import getSpaces from './getSpaces'
import arrayToObject from '../../utils/arrayToObject'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spaces = await getSpaces(id)

      resolve({
        spaces: arrayToObject(spaces)
      })
    } catch (err) {
      reject(err)
    }
  })
}
