const SubsidiaryProduct = require('../models/subsidiaryproduct')
const ProductOwner = require('../models/productowner')
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

async function sp_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let subsidiary_products = await SubsidiaryProduct.find({subsidiary: subsidiary_id}).populate('product')
		let products_owner = await ProductOwner.find({subsidiary: subsidiary_id})

		let products_response = subsidiary_products.map( sp => {
			let product = {
				sp: sp._id,
				subsidiary: sp.subsidiary,
				salePrice: sp.salePrice,
				stock: sp.stock,
				product_id: sp.product.product_id,
				description: sp.product.description,
				bar_code: sp.product.bar_code,
				category: sp.product.category,
				unit: sp.product.unit,
				brand: sp.product.brand,
				suggestedPrice: sp.product.suggestedPrice,
				price: sp.price,
				min: sp.min,
				max: sp.max
			}
			return product
		})

		products_owner.map( po => {
			let product = {
				po: po._id,
				subsidiary: po.subsidiary,
				salePrice: po.salePrice,
				price: po.price,
				stock: po.stock,
				product_id: po.product_id,
				description: po.description,
				bar_code: po.bar_code,
				category: po.category,
				unit: po.unit,
				brand: po.brand,
				min: po.min,
				max: po.max
			}

			products_response.push(product)
		})

		sendJSONresponse(res, 200, products_response)
	} catch(e) {
		return next(e)
	}
}

async function sp_update(req, res, next) {
	try {
		const sp_id = req.params.spId

		let sp_updated = await SubsidiaryProduct.findByIdAndUpdate(sp_id, req.body, { new: true })
		sp_updated = await SubsidiaryProduct.populate(sp_updated, 'product')

		sendJSONresponse(res, 200, sp_updated)
	} catch(e) {
		return next(e)
	}
}

async function sp_delete(req, res, next) {
	try {
		const sp_id = req.params.spId

		let sp_deleted = await SubsidiaryProduct.findByIdAndRemove(sp_id)

		sendJSONresponse(res, 200, sp_deleted)
	} catch (e) {
		return next(e)
	}
}

module.exports = {
	sp_create,
	sp_list,
	sp_update,
	sp_delete
}
