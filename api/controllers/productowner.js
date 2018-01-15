const ProductOwner = require('../models/productowner')
const sendJSONresponse = require('./shared').sendJSONresponse

async function po_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let product_owner = new ProductOwner(req.body)
		product_owner.subsidiary = subsidiary_id

		product_owner = await product_owner.save()

		let product = {
			po: product_owner._id,
			subsidiary: product_owner.subsidiary,
			salePrice: product_owner.subsidiary,
			stock: product_owner.stock,
			product_id: product_owner.product._id,
			description: product_owner.description,
			bar_code: product_owner.bar_code,
			category: product_owner.category,
			unit: product_owner.unit,
			brand: product_owner.brand
		}

		sendJSONresponse(res, 201, product)
	} catch (e) {
		return next(e)
	}
}

async function po_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		const products_owner = await ProductOwner.find({subsidiary: subsidiary_id})

		sendJSONresponse(res, 200, products_owner)
	} catch (e) {
		return next(e)
	}
}

async function po_update(req, res, next) {
	try {
		const product_owner_id = req.params.poId

		let product_updated = await ProductOwner.findByIdAndUpdate(product_owner_id, req.body, { new: true})

		sendJSONresponse(res, 200, product_updated)
	} catch (e) {
		return next(e)
	}
}

async function po_delete(req, res, next) {
	try {
		const product_owner_id = req.params.poId

		let product_deleted = await ProductOwner.findByIdAndRemove(product_owner_id)

		sendJSONresponse(res, 200, product_deleted)
	} catch (e) {
		return next(e)
	}
}

module.exports = {
	po_create,
	po_list,
	po_update,
	po_delete
}