import express from 'express'
import * as controller from '../controllers/ajax'

const router = express.Router()

router.get('/ajax/filters/', controller.getFilters)
router.get('/ajax/space-types/', controller.getSpaceTypes)

export default router
