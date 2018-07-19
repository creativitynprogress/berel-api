const sendJSONresponse = require('./shared').sendJSONresponse
const Purchase = require('../models/purchase')
const BaseSubsidiary = require('../models/subsidiarybase')
const InkSubsidiary = require('../models/inksubsidiary')
const Base = require('../models/base')
const Ink = require('../models/ink')
const Provider = require('../models/provider')
const ProductOwner = require('../models/productowner')
const Line = require('../models/line')

async function purchase_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchase = new Purchase(req.body)
		purchase.subsidiary = subsidiary_id

		purchase.bases.map(async (p) => {
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

		purchase.inks.map(async (p) => {
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

		purchase.products_owner.map(async (p) => {
			try {
				let po = await ProductOwner.findById(p.product)

				po.stock += p.quantity
				po = await po.save()
			} catch(e) {
				return next(e)
			}
		})


		purchase = await purchase.save()
		purchase = await Base.populate(purchase, 'bases.base')
		purchase = await Ink.populate(purchase, 'inks.ink')
		purchase = await Provider.populate(purchase, 'provider')

		sendJSONresponse(res, 201, purchase)
	} catch(e) {
		return next(e)
	}
}

async function purchase_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id
		let initial = req.query.initial ? Number(req.query.initial) : null
    let end = req.query.end ? Number(req.query.end) : null

		let query = {
      subsidiary: subsidiary_id
    }

		if (initial && end) query.date = { $gt: initial, $lt: end }

		let purchases = await Purchase.find(query).populate('bases.base inks.ink products_owner.product provider')

		sendJSONresponse(res, 200, purchases)
	} catch(e) {
		return next(e)
	}
}

async function purchase_delete(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id
		const purchase_id = req.params.purchase_id

		let pb = await Purchase.findByIdAndRemove(purchase_id)

		pb.bases.map(async (p) => {
			try {
				let base_subsidiary = await BaseSubsidiary.findById(p.base)

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

async function purchase_analysis (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let purchases = await Purchase.find({subsidiary: subsidiary_id})
			.populate(
				{path: 'bases.base', model: Base, populate: [{path: 'line', model: Line}]}
			)
			.populate('inks.ink')
			.populate('products_owner.product')
//'bases.base.line inks.ink products_owner.product'
		let formated_purchases = []

		purchases.map(p => {
			let pay_type = []

			if (p.pays.findIndex(p => p.type == 'cash') >= 0) pay_type.push('Efectivo');
      if (p.pays.findIndex(p => p.type == 'card') >= 0) pay_type.push('Tarjeta');
      if (p.pays.findIndex(p => p.type == 'transfer') >= 0) pay_type.push('Transferencia');
      if (p.pays.findIndex(p => p.type == 'check') >= 0) pay_type.push('Cheque');

			console.log(p.bases, p.inks, p.products_owner)

			p.bases.map(b => {
				const purchase = {
          date: p.date,
          product_id: b.base ? b.base.product_id : 'Descontinuado',
          pay_type: pay_type,
          quantity: b.quantity,
          total: b.total,
					line: b.base.line.name
        };

				formated_purchases.push(purchase)
			})

			p.inks.map(i => {
				const purchase = {
					date: p.date,
					product_id: i.ink ? i.ink.product_id : 'Descontinuado',
					pay_type: pay_type,
					quantity: i.quantity,
					total: i.total
				}

				formated_purchases.push(purchase)
			})

			p.products_owner.map(product => {
				const purchase = {
					date: p.date,
					product_id: product.product.product_id,
					pay_type: pay_type,
					quantity: product.quantity,
					total: product.total
				}

				formated_purchases.push(purchase)
			})
		})

		sendJSONresponse(res, 200, formated_purchases)
	} catch(e) {
		return next(e)
	}
}


module.exports = {
	purchase_create,
	purchase_list,
	purchase_delete,
	purchase_analysis
}
