import toJSON from '../utils/toJSON'
import getAllColors from '../color/getAll'
import getAllCategories from '../category/getAll'
import getAllSpaceTypes from '../spaceType/getAll'

export default () => (
  new Promise(async (resolve, reject) => {
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
)
