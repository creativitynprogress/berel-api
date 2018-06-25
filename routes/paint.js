const express = require('express')
const paints_controller = require('../controllers/paint')
const require_auth = require('../middlewares/auth').require_auth
const multer = require('multer')

const paint_routes = express.Router()

paint_routes.post('/', require_auth, paints_controller.paint_create)
paint_routes.get('/', require_auth, paints_controller.paint_list)
paint_routes.get('/owner', require_auth, paints_controller.paint_owner_list)
paint_routes.get('/:paint_id', require_auth, paints_controller.paint_details)
paint_routes.get('/user/:paint_id', require_auth, paints_controller.paint_details_for_users)
paint_routes.put('/:paint_id', require_auth, paints_controller.paint_update)
paint_routes.delete('/:paint_id', require_auth, paints_controller.paint_delete)
paint_routes.post('/:paint_id/presentation', require_auth, paints_controller.presentation_create)
paint_routes.put('/:paint_id/presentation/:presentation_id', require_auth, paints_controller.presentation_update)
paint_routes.delete('/:paint_id/presentation/:presentation_id', require_auth, paints_controller.presentation_delete)

const upload = multer({ dest: 'uploads/' })
paint_routes.post('/excelupload/:line_id', upload.single('file-to-upload'), paints_controller.paints_by_excel )

module.exports = paint_routes
