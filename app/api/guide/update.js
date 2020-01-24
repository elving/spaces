import get from 'lodash/get'

import getById from './getById'
import sanitize from './sanitize'
import parseError from '../utils/parseError'
import uploadImageFromUrl from '../../utils/image/uploadImageFromUrl'
import { invalidateFromCache } from '../cache'

export default (id, props) => (
  new Promise(async (resolve, reject) => {
    const guide = await getById(id)
    const updates = sanitize(props)

    guide.set(updates)

    if (guide.isModified('coverImage')) {
      try {
        const coverImage = await uploadImageFromUrl(
          'guides', get(updates, 'coverImage')
        )

        guide.set('coverImage', coverImage)
      } catch (err) {
        return reject(err)
      }
    }

    guide.save(async (err, updatedGuide) => {
      if (err) {
        return reject(parseError(err))
      }

      await invalidateFromCache(id)
      resolve(updatedGuide)
    })
  })
)
