const sendJSONresponse = require('./shared').sendJSONresponse
const Transfer = require('../models/transfer')
const Ticket = require('../models/ticket').ticket
const calculatePays = require('../utils/calculatepays')

async function transfer_create(req, res, next) {
	try {
		const user = req.user
		const subsidiary_id = req.params.subsidiary_id
		const ticket_id = req.params.ticket_id

		let ticket = await Ticket.findById(ticket_id).populate('cash_pays card_pays transfers checks')
		if (!ticket) throw Error('Ticket not found')

		let transfer = new Transfer(req.body)
		transfer.subsidiary = subsidiary_id
		transfer.ticket = ticket_id

		ticket.payed = calculatePays(ticket, transfer.amount)

		ticket.transfers.push(transfer._id)
		await ticket.save()
		transfer = await transfer.save()

		sendJSONresponse(res, 201, {payment: transfer, payed: ticket.payed})
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	transfer_create
}