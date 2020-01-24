import get from 'lodash/get'
import map from 'lodash/map'
import head from 'lodash/head'
import concat from 'lodash/concat'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'
import flattenDeep from 'lodash/flattenDeep'

import toIds from '../utils/toIds'
import toJSON from '../utils/toJSON'
import parseError from '../utils/parseError'
import searchSpaces from '../space/search'
import toIdsFromPath from '../utils/toIdsFromPath'
import searchProducts from '../product/search'
import getFromCacheOrQuery from '../utils/getFromCacheOrQuery'

import { saveToCache } from '../cache'

const getItems = (shortIds, modelName, single = false) => (
  new Promise(async (resolve, reject) => {
    try {
      const search = modelName === 'Product' ? searchProducts : searchSpaces
      const searchResults = get(
        await search({ limit: 1000, shortIds }), 'results', []
      )

      resolve(single ? head(searchResults) : searchResults)
    } catch (err) {
      reject(err)
    }
  })
)

export default sid => (
  new Promise((resolve, reject) => {
    const key = `guide-${sid}`
    const query = () => {
      mongoose
        .model('Guide')
        .findOne({ sid })
        .exec(async (err, guide = {}) => {
          if (err) {
            return reject(parseError(err))
          }

          let sections = []
          let guideToJSON = {}
          let idsToInvalidate = []

          const updateSections = section => {
            sections = concat(sections, section)
          }

          const updateIdsToInvalidate = items => {
            const itemsArray = isArray(items) ? items : [items]

            idsToInvalidate = concat(
              idsToInvalidate,
              toIds(itemsArray),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'brand'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'colors'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'products'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'spaceType'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'redesigns'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'createdBy'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'categories'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'spaceTypes'))
              ),
              flattenDeep(
                map(itemsArray, item => toIdsFromPath(item, 'originalSpace'))
              )
            )
          }

          for (const section of guide.sections) {
            const type = section.type
            const title = section.title
            const modelName = section.modelName

            switch (section.type) {
              case 'grid': {
                const items = await getItems(section.items, section.modelName)

                updateIdsToInvalidate(items)
                updateSections({
                  type,
                  title,
                  items,
                  modelName
                })

                break
              }

              case 'item-text': {
                const item = await getItems(
                  section.item, section.modelName, true
                )

                updateIdsToInvalidate(item)
                updateSections({
                  item,
                  type,
                  text: section.text,
                  title,
                  modelName
                })

                break
              }

              case 'related': {
                const item = await getItems(
                  section.item, section.modelName, true
                )

                const related = await getItems(
                  section.items, section.modelName
                )

                updateIdsToInvalidate(item)
                updateIdsToInvalidate(related)
                updateSections({
                  item,
                  type,
                  title,
                  related,
                  modelName
                })

                break
              }

              case 'text': {
                updateSections({
                  type,
                  text: section.text
                })

                break
              }

              default: {
                updateSections(section)
              }
            }
          }

          guideToJSON = toJSON(guide)
          idsToInvalidate = concat(idsToInvalidate, guideToJSON.id)
          guideToJSON.sections = sections

          if (!isEmpty(guideToJSON)) {
            await saveToCache(key, guideToJSON, idsToInvalidate)
            resolve(guideToJSON)
          } else {
            resolve({})
          }
        })
    }

    getFromCacheOrQuery(key, query, resolve)
  })
)
