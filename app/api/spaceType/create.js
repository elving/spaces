import get from 'lodash/get'
import has from 'lodash/has'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import sanitize from './sanitize'
import setImage from './setImage'
import validate from './validate'
import parseError from '../utils/parseError'
import findCategoryByName from '../category/findByName'
import { removeFromCache } from '../cache'

export default (props) => (
  new Promise(async (resolve, reject) => {
    const categories = []
    const sanitizedProps = sanitize(props)
    const SpaceType = mongoose.model('SpaceType')
    const propErrors = validate(sanitizedProps)

    if (!isEmpty(propErrors)) {
      return reject(propErrors)
    }

    try {
      for (let category of get(sanitizedProps, 'categories', [])) {
        category = await findCategoryByName(category, true)

        if (!isEmpty(category)) {
          categories.push(category)
        }
      }

      set(sanitizedProps, 'categories', toIds(categories))
    } catch (err) {
      if (has(err, 'name')) {
        return reject({ categories: get(err, 'name') })
      }

      return reject({
        generic: (
          'There was an error while trying to create this room. ' +
          'Please try again.'
        )
      })
    }

    const spaceType = new SpaceType(sanitizedProps)
    const validationErrors = spaceType.validateSync()

    if (!isEmpty(validationErrors)) {
      return reject(parseError(validationErrors))
    }

    spaceType.save(async (err) => {
      if (err) {
        return reject(parseError(err))
      }

      await removeFromCache('spaceType-all')
      setImage(spaceType)
      resolve(spaceType)
    })
  })
)
