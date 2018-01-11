const SubsidiaryProduct = require('../models/subsidiaryproduct')
const sendJSONresponse = require('./shared').sendJSONresponse
const Product = require('../models/product')

async function sp_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let product = new Product(req.body)
		product.subsidiary = subsidiary_id

		product = product.save()

		sendJSONresponse(res, 201, product)
	} catch (e) {
		return next(e)
	}
}