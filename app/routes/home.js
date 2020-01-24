import express from 'express'
import controller from '../controllers/home'

const router = express.Router()

router.get('/popular/', controller)

export default router
