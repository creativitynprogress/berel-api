'use strict'

const Product = require('../models/product')
const sendJSONresponse = require('./shared').sendJSONresponse

async function product_create(req, res, next) {
  try {

    let product = new Product(req.body)

    product = await product.save()

    sendJSONresponse(res, 201, product)
  } catch (e) {
    return next(e)
  }
}

async function product_list(req, res, next) {
  try {

    let products = await Product.find({}).populate('line')

    sendJSONresponse(res, 200, products)

  } catch (e) {
    return next(e)
  }
}

async function product_update(req, res, next) {
  try {
    const productId = req.params.productId

    let product = await Product.findByIdAndUpdate(productId, req.body, {new: true})
    if (!product) {
      return next(Error('product not found'))
    }
    sendJSONresponse(res, 200, product)
  } catch(e) {
    return next(e)
  }
}

async function product_delete(req, res, next) {
  try {
    const productId = req.params.productId

    let product = await Product.findByIdAndRemove(productId)

    sendJSONresponse(res, 200, product)
  } catch(e) {
    return next(e)
  }
}

module.exports = {
  product_create,
  product_list,
  product_update,
  product_delete
}
