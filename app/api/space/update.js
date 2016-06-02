import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import sanitize from './sanitize'
import findById from './findById'

import { invalidateFromCache } from '../cache'
import { toIds, parseError, toIdsFromPath } from '../utils'

export default (id, props, forceUpdate = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const space = await findById(id)
      const updatedBy = get(props, 'updatedBy')
      const updatedByAdmin = get(props, 'updatedByAdmin', false)

      if (!forceUpdate && updatedByAdmin) {
        forceUpdate = true
      }

      if (isEmpty(space)) {
        return reject({
          generic: `Space ${id} not found.`
        })
      }

      if (!forceUpdate) {
        if (!isEqual(updatedBy, space.get('createdBy.id'))) {
          return reject({
            err: {
              genereic: 'Not authorized'
            }
          })
        }
      }

      space.update(sanitize(props, false), (err) => {
        if (err) {
          return reject(parseError(err))
        }

        space
          .populate('products')
          .populate('spaceType')
          .populate('originalSpace', async (err, space) => {
            if (err) {
              return reject(parseError(err))
            }

            await invalidateFromCache([
              toIds(space),
              toIdsFromPath(space, 'products'),
              toIdsFromPath(space, 'createdBy'),
              toIdsFromPath(space, 'redesigns')
            ])

            resolve(space)
          })
      })
    } catch (err) {
      reject(err)
    }
  })
}
