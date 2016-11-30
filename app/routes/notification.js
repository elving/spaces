import express from 'express'
import * as controller from '../controllers/notification'

const router = express.Router()
const ajaxRoot = '/ajax/notifications'

router.get('/notifications/', controller.renderIndex)
router.get(`${ajaxRoot}/`, controller.getNotifications)
router.get(`${ajaxRoot}/all/`, controller.getAllNotifications)
router.get(`${ajaxRoot}/count/`, controller.getNotificationsCount)
router.post(`${ajaxRoot}/read/`, controller.markNotificationsRead)

export default router
