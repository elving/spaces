import mongoose from 'mongoose'

import getAll from '../../app/api/spaceType/getAll'
import update from '../../app/api/spaceType/update'
import toStringId from '../../app/api/utils/toStringId'

const getSpaceCount = (spaceType) => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ spaceType })
      .count((err, count) => {
        if (err) {
          return reject(err)
        }

        resolve(count)
      })
  })
)

export default () => {
  return new Promise(async (resolve, reject) => {
    console.log('spaceType/setSpacesCount => Start')
    try {
      const spaceTypes = await getAll()

      for (let spaceType of spaceTypes) {
        const id = toStringId(spaceType)
        const spacesCount = await getSpaceCount(id)
        await update(id, { spacesCount })
      }

      console.log('spaceType/setSpacesCount => Done')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
