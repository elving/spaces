import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/spaceType'

const router = express.Router()
const ajaxRoot = '/ajax/space-types'
const adminRoot = '/admin/space-types'

const {
  addSpaceType,
  updateSpaceType,
  destroySpaceType,
  renderAddSpaceType,
  renderAllSpaceTypes,
  renderUpdateSpaceType
} = controller

router.get('/rooms/', controller.renderIndex)
router.get('/rooms/:slug/', controller.renderDetail)

router.get(`${adminRoot}/`, isAdmin, renderAllSpaceTypes)
router.get(`${adminRoot}/add/`, isAdmin, renderAddSpaceType)
router.get(`${adminRoot}/:sid/update/`, isAdmin, renderUpdateSpaceType)

router.post('/ajax/space-types/', isAdmin, addSpaceType)
router.put('/ajax/space-types/:sid/', isAdmin, updateSpaceType)
router.delete('/ajax/space-types/:sid/', isAdmin, destroySpaceType)

export default router
