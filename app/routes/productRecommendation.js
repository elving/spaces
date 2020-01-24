import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/productRecommendations'

const router = express.Router()
const ajaxRoot = '/ajax/recommendations'

router.get('/admin/recommendations/', isAdmin, controller.renderAdmin)

router.post(`${ajaxRoot}/add/`, controller.addRecommendation)
router.put(`${ajaxRoot}/:id/`, controller.updateRecommendation)
router.delete(`${ajaxRoot}/:id/`, controller.destroyRecommendation)

export default router
