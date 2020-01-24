import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/color'

const router = express.Router()
const ajaxRoot = '/ajax/colors'
const adminRoot = '/admin/colors'

router.get(`${adminRoot}/`, isAdmin, controller.renderAllColors)
router.get(`${adminRoot}/add/`, isAdmin, controller.renderAddColor)
router.get(`${adminRoot}/:sid/update/`, isAdmin, controller.renderUpdateColor)

router.post(`${ajaxRoot}/`, isAdmin, controller.addColor)
router.put(`${ajaxRoot}/:sid/`, isAdmin, controller.updateColor)
router.delete(`${ajaxRoot}/:sid/`, isAdmin, controller.destroyColor)

export default router
