import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/space'

const router = express.Router()
const ajaxRoot = '/ajax/spaces'

// router.get('/admin/spaces/', isAdmin, controller.renderAllProducts)
router.get('/spaces/create/', controller.renderCreateSpace)
// router.get('/spaces/:sid/update/', controller.renderUpdateProduct)

// router.get(`${ajaxRoot}/fetch/`, controller.fetchProductInfo)
// router.post(`${ajaxRoot}/create/`, controller.addProduct)
// router.put(`${ajaxRoot}/:sid/`, controller.updateProduct)
// router.delete(`${ajaxRoot}/:sid/`, controller.destroyProduct)

export default router
