const sendJSONresponse = require('./shared').sendJSONresponse
const CardPayment = require('../models/cardpayment')

async function cp_create(req, res, next) {
	try {
		const user = req.user
		const subsidiary_id = req.params.subsidiary_id
		const ticket_id = req.params.ticket_id

		let card_payment = new CardPayment(req.body)
		card_payment.user = user._id
		card_payment.subsidiary = subsidiary_id
		card_payment.ticket = ticket_id

		card_payment = await card_payment.save()

		sendJSONresponse(res, 201, card_payment)
	} catch (e) {
		return next(e)
	}
}

async function cp_list_by_ticket(req, res, next) {
	try {
		const ticket_id = req.params.ticket_id

		let payments = await CardPayment.find({ticket: ticket_id})

		sendJSONresponse(res, 200, payments)
	} catch(e) {
		return next(e)
	}
}

async function cp_delete(req, res, next) {
	try {
		const cp_id = req.params.cp_id

		let payment = await CardPayment.findByIdAndRemove(cp_id)

		sendJSONresponse(res, 200, payment)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	cp_create,
	cp_list_by_ticket,
	cp_delete
}
