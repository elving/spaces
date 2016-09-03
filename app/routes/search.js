import express from 'express'
import * as controller from '../controllers/search'

const router = express.Router()

router.get('/search/', controller.renderSearchResults)

router.get('/ajax/rooms/search/', controller.searchSpaceTypes)
router.get('/ajax/spaces/search/', controller.searchSpaces)
router.get('/ajax/follows/search/', controller.searchFollows)
router.get('/ajax/products/search/', controller.searchProducts)
router.get('/ajax/designers/search/', controller.searchUsers)
router.get('/ajax/categories/search/', controller.searchCategories)

export default router
