import log from '../../app/utils/log'
import getAll from '../../app/api/spaceType/getAll'
import setImage from '../../app/api/spaceType/setImage'

export default () => (
  new Promise(async (resolve, reject) => {
    log('spaceType/setImage => Start')

    try {
      const spaceTypes = await getAll()

      for (const spaceType of spaceTypes) {
        await setImage(spaceType)
      }

      log('spaceType/setImage => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
)
