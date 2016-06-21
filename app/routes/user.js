import express from 'express'
import * as controller from '../controllers/user'

const router = express.Router()
const ajaxRoot = '/ajax/designers'

router.get('/designers/', controller.renderIndex)

export default router
