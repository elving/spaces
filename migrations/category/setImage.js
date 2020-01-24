import log from '../../app/utils/log'
import getAll from '../../app/api/category/getAll'
import setImage from '../../app/api/category/setImage'

export default () => (
  new Promise(async (resolve, reject) => {
    log('category/setImage => Start')

    try {
      const categories = await getAll()

      for (const category of categories) {
        await setImage(category)
      }

      log('category/setImage => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
)
