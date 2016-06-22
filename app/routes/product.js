import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/product'

const router = express.Router()
const ajaxRoot = '/ajax/products'

router.get('/products/', controller.renderIndex)
router.get('/products/add/', controller.renderAddProduct)
router.get('/products/:sid/update/', controller.renderUpdateProduct)

router.get('/admin/products/', isAdmin, controller.renderAdminProducts)

router.get(`${ajaxRoot}/fetch/`, controller.fetchProductInfo)
router.post(`${ajaxRoot}/add/`, controller.addProduct)
router.put(`${ajaxRoot}/:id/`, controller.updateProduct)
router.delete(`${ajaxRoot}/:id/`, controller.destroyProduct)

export default router
