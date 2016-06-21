import express from 'express'
import * as controller from '../controllers/search'

const router = express.Router()

router.get('/products/search/', controller.renderProductsSearch)

router.get('/ajax/spaces/search/', controller.searchSpaces)
router.get('/ajax/products/search/', controller.searchProducts)
router.get('/ajax/designers/search/', controller.searchUsers)

export default router
