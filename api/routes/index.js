module.exports = (app, io) => {
    const express = require('express')
    const passportService = require('../config/passport')
    const passport = require('passport')

    const authenticathion_controller = require('../controllers/authentication')
    const supplies_controller = require('../controllers/supplie')
    const products_controller = require('../controllers/product')
    
    const require_auth = passport.authenticate('jwt', {
        session: false
      })
      
    const require_login = passport.authenticate('local', {
        session: false
    })

    const api_routes = express.Router()
    const auth_routes = express.Router()

    api_routes.use('/auth', auth_routes)
    auth_routes.post('/register', authenticathion_controller.register)
    auth_routes.post('/login', require_login, authenticathion_controller.login)

    api_routes.post('/supplie', require_auth, supplies_controller.supplie_create)
    api_routes.put('/supplie', require_auth, supplies_controller.supplie_update)
    api_routes.delete('/supplie', require_auth, supplies_controller.supplie_delete)
    api_routes.get('/supplie', require_auth, supplies_controller.supplie_list)

    api_routes.post('/product', require_auth, products_controller.product_create)
    api_routes.put('/product/productId', require_auth, products_controller.product_update)
    api_routes.get('/product', require_auth, products_controller.product_list)
    api_routes.delete('/product/productId', require_auth, products_controller.product_delete)


    app.use('/api', api_routes)
}