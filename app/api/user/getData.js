import getSpaces from './getSpaces'

export default (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spaces = await getSpaces(id)

      resolve({
        spaces
      })
    } catch (err) {
      reject(err)
    }
  })
}
