import toJSON from '../api/utils/toJSON'
import getAllSpaceTypes from '../api/spaceType/getAll'
import getSearchFilters from '../api/common/getSearchFilters'

export const getFilters = async (req, res) => {
  try {
    const filters = await getSearchFilters()
    res.status(200).json(filters)
  } catch (err) {
    res.status(500).json({ err })
  }
}

export const getSpaceTypes = async (req, res) => {
  try {
    const spaceTypes = await getAllSpaceTypes()
    res.status(200).json({ spaceTypes: toJSON(spaceTypes) })
  } catch (err) {
    res.status(500).json({ err })
  }
}
