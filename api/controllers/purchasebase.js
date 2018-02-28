const sendJSONresponse = require('./shared').sendJSONresponse
const PurchaseBase = require('../models/purchasebase')
const BaseSubsidiary = require('../models/basesubsidiary')

async function pb_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchase_base = new PurchaseBase(req.body)
		purchase_base.subsidiary = subsidiary_id

		let base_subsidiary = await BaseSubsidiary.findOne({subsidiary: subsidiary_id, base: purchase_base.base})
		if (!base_subsidiary) throw Error('base_subsidiary not found')

		base_subsidiary.stock += purchase_base.quantity
		base_subsidiary = await base_subsidiary.save()

		purchase_base = await purchase_base.save()

		sendJSONresponse(res, 201, purchase_base)
	} catch(e) {
		return next(e)
	}
}

async function pb_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchases_base = await PurchaseBase.find({subsidiary: subsidiary_id})

		sendJSONresponse(res, 200, purchases_base)
	} catch(e) {
		return next(e)
	}
}


module.exports = {
	pb_create,
	pb_list
}