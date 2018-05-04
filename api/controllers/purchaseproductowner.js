const sendJSONresponse = require('./shared').sendJSONresponse
const PurchaseProductOwner = require('../models/purchaseproductowner')
const ProductOwner = require('../models/productowner')

async function ppo_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let ppo = new PurchaseProductOwner(req.body)
		ppo.subsidiary = subsidiary_id

		ppo.products.map(async (p) => {
			let product_owner = await ProductOwner.findById(p.product)

			product_owner.stock += p.quantity;
			await product_owner.save()
		})

		ppo = await ppo.save()

		ppo = await ProductOwner.populate(ppo, 'products.product')

		sendJSONresponse(res, 201, ppo)
	} catch(e) {
		return next(e)
	}
}

async function ppo_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let ppo_list = await PurchaseProductOwner.find({subsidiary: subsidiary_id}).populate('products.product')

		sendJSONresponse(res, 200, ppo_list)
	} catch (e) {
		return next(e)
	}
}

async function ppo_delete(req, res, next) {
	try {
		const ppo_id = req.params.ppo_id

		let ppo = await PurchaseProductOwner.findByIdAndRemove(ppo_id)

		ppo.products.map(async (p) => {
			try {
				let product_owner = await ProductOwner.findById(p.product)


				if (product_owner) {
					product_owner.stock -= p.quantity
					await product_owner.save()
				}

			} catch(e) {
				return next(e)
			}
		})

		sendJSONresponse(res, 200, ppo)


	} catch (e) {
		return next(e)
	}
}

module.exports = {
	ppo_create,
	ppo_list,
	ppo_delete
}
