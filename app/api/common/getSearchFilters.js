import { toJSON } from '../utils'
import { default as getAllColors } from '../color/getAll'
import { default as getAllCategories } from '../category/getAll'
import { default as getAllSpaceTypes } from '../spaceType/getAll'

export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      const colors = await getAllColors()
      const categories = await getAllCategories()
      const spaceTypes = await getAllSpaceTypes()

      resolve({
        colors: toJSON(colors),
        categories: toJSON(categories),
        spaceTypes: toJSON(spaceTypes)
      })
    } catch (err) {
      reject(err)
    }
  })
}
