const sendJSONresponse = require('./shared').sendJSONresponse
const PurchaseBase = require('../models/purchasebase')
const BaseSubsidiary = require('../models/subsidiarybase')
const Base = require('../models/base')

async function pb_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchase_base = new PurchaseBase(req.body)
		purchase_base.subsidiary = subsidiary_id

		purchase_base.bases.map(async (p) => {
			try {
				let base_subsidiary = await BaseSubsidiary.findOne({subsidiary: subsidiary_id, base: p.base})
				if (!base_subsidiary) {
					let base_subsidiary = new BaseSubsidiary({base: p.base, subsidiary: subsidiary_id, stock: p.quantity})

					await base_subsidiary.save()
				} else {
					base_subsidiary.stock += p.quantity
					await base_subsidiary.save()
				}

			} catch(e) {
				return next(e)
			}
		})

		purchase_base = await purchase_base.save()
		purchase_base = await Base.populate(purchase_base, 'bases.base')

		sendJSONresponse(res, 201, purchase_base)
	} catch(e) {
		return next(e)
	}
}

async function pb_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchases_base = await PurchaseBase.find({subsidiary: subsidiary_id}).populate('bases.base')

		sendJSONresponse(res, 200, purchases_base)
	} catch(e) {
		return next(e)
	}
}

async function pb_delete(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id
		const pb_id = req.params.pb_id

		let pb = await PurchaseBase.findByIdAndRemove(pb_id)

		pb.bases.map(async (p) => {
			try {
				let base_subsidiary = await BaseSubsidiary.findById(p.base)

				console.log(p)

				if (base_subsidiary) {
					base_subsidiary.stock -= p.quantity
					await base_subsidiary.save()
				}

			} catch(e) {
				return next(e)
			}
		})

		sendJSONresponse(res, 200, pb)
	} catch(e) {
		return next(e)
	}
}


module.exports = {
	pb_create,
	pb_list,
	pb_delete
}
