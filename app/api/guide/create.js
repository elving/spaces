import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import sanitize from './sanitize'
import parseError from '../utils/parseError'
import uploadImageFromUrl from '../../utils/image/uploadImageFromUrl'

import { removeFromCache } from '../cache'

export default props => (
  new Promise(async (resolve, reject) => {
    const sanitizedProps = sanitize(props)
    const Guide = mongoose.model('Guide')
    const guide = new Guide(sanitizedProps)
    const errors = guide.validateSync()

    if (!isEmpty(errors)) {
      return reject(parseError(errors))
    }

    const coverImage = await uploadImageFromUrl(
      'guides', get(sanitizedProps, 'coverImage')
    )

    guide.set('coverImage', coverImage)

    guide.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('guide-all')
      resolve(guide)
    })
  })
)
