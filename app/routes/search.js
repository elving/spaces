import express from 'express'
import * as controller from '../controllers/search'

const router = express.Router()

router.get('/products/search/', controller.renderProductsSearch)
router.get('/ajax/products/search/', controller.searchProducts)

export default router
