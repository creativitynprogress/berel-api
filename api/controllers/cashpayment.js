const sendJSONresponse = require('./shared').sendJSONresponse
const CashPayment = require('../models/cashpayment')
const Ticket = require('../models/ticket').ticket
const calculatePays = require('../utils/calculatepays')

async function cp_create(req, res, next) {
	try {
		const user = req.user
		const subsidiary_id = req.params.subsidiary_id
		const ticket_id = req.params.ticket_id
		let total = 0

		let ticket = await Ticket.findById(ticket_id).populate('cash_pays card_pays transfers checks')
		if (!ticket) throw Error('Ticket not found')

		let cash_payment = new CashPayment(req.body)
		cash_payment.user = user._id
		cash_payment.subsidiary = subsidiary_id
		cash_payment.ticket = ticket_id

		ticket.payed = calculatePays(ticket, cash_payment.amount)

		ticket.cash_pays.push(cash_payment._id)
		await ticket.save()
		cash_payment = await cash_payment.save()

		sendJSONresponse(res, 201, {payment: cash_payment, payed: ticket.payed})
	} catch (e) {
		return next(e)
	}
}

//	Esta funcion no es necesaria
async function cp_list_by_ticket(req, res, next) {
	try {
		const ticket_id = req.params.ticket_id

		let payments = await CashPayment.find({ticket: ticket_id})

		sendJSONresponse(res, 200, payments)
	} catch(e) {
		return next(e)
	}
}

async function cp_delete(req, res, next) {
	try {
		const ticket_id = req.params.ticket_id
		const cp_id = req.params.cp_id

		let ticket = await Ticket.findById(ticket_id)
		if (!ticket) throw Error('Ticket not found')

		ticket.cash_payments.remove(cp_id)
		let payment = await CashPayment.findByIdAndRemove(cp_id)

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