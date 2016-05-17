import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/brand'

const router = express.Router()
const ajaxRoot = '/ajax/brands'
const adminRoot = '/admin/brands'

router.get(`${ajaxRoot}/`, isAdmin, controller.renderAllBrands)
router.get(`${ajaxRoot}/add/`, isAdmin, controller.renderAddBrand)
router.get(`${ajaxRoot}/:sid/update/`, isAdmin, controller.renderUpdateBrand)

router.post(`${ajaxRoot}/`, isAdmin, controller.addBrand)
router.put(`${ajaxRoot}/:sid/`, isAdmin, controller.updateBrand)
router.delete(`${ajaxRoot}/:sid/`, isAdmin, controller.destroyBrand)

export default router
