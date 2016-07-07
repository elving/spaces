import getAll from '../../app/api/category/getAll'
import setImage from '../../app/api/category/setImage'

export default () => {
  return new Promise(async (resolve, reject) => {
    console.log('category/setImage => Start')
    try {
      const categories = await getAll()

      for (let category of categories) {
        await setImage(category)
      }

      console.log('category/setImage => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
