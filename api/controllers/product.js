const Product = require('../models/product')
const sendJSONresponse = require('./shared').sendJSONresponse

async function product_create(req, res, next) {
    try {
        const user = req.user

        let product = new Product(req.body)
        product = await product.save()

        sendJSONresponse(res, 201, product)
    } catch(e) {
        return next(e)
    }
}

async function product_update(req, res, next) {
    try {
        const product_id = req.params.productId 

        let product = await Product.findById(product_id)

        product = Object.assign(product, req.body)
        product = await product.save()

        sendJSONresponse(res, 200, product)
    } catch(e) {
        return next(e)
    }
}

async function product_delete(req, res, next) {
    try {
        const product_id = req.params.productId

        let product = await Product.findByIdAndRemove(product_id)

        sendJSONresponse(res, 200, product)
    } catch(e) {
        return next(e)
    }
}

async function product_list(req, res, next) {
    try {
        const user = req.user

        let products = await Product.find({user: user._id}).populate('elements')

        sendJSONresponse(res, 200, products)
    } catch(e) {
        return next(e)
    }
}

module.exports = {
    product_create,
    product_update,
    product_delete,
    product_list
}
