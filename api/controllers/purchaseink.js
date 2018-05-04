const sendJSONresponse = require('./shared').sendJSONresponse
const PurchaseInk = require('../models/purchaseink')
const InkSubsidiary = require('../models/inksubsidiary')
const Ink = require('../models/ink')

async function pi_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchase_ink = new PurchaseInk(req.body)
		purchase_ink.subsidiary = subsidiary_id

		purchase_ink.inks.map(async (p) => {
			try {
				let ink_subsidiary = await InkSubsidiary.findOne({subsidiary: subsidiary_id, ink: p.ink})
				if (!ink_subsidiary) {
					let ink_subsidiary = new InkSubsidiary({ink: p.ink, subsidiary: subsidiary_id, stock: p.quantity})

					await ink_subsidiary.save()
				} else {
					ink_subsidiary.stock += p.quantity
					await ink_subsidiary.save()
				}

			} catch(e) {
				return next(e)
			}
		})

		purchase_ink = await purchase_ink.save()
		purchase_ink = await Ink.populate(purchase_ink, 'inks.ink')

		sendJSONresponse(res, 201, purchase_ink)
	} catch(e) {
		return next(e)
	}
}

async function pi_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchases_ink = await PurchaseInk.find({subsidiary: subsidiary_id}).populate('inks.ink')

		sendJSONresponse(res, 200, purchases_ink)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	pi_create,
	pi_list
}