const sendJSONresponse = require('./shared').sendJSONresponse
const Check = require('../models/check')
const Ticket = require('../models/ticket').ticket
const calculatePays = require('../utils/calculatepays')

async function check_create(req, res, next) {
	try {
		const user = req.user
		const subsidiary_id = req.params.subsidiary_id
		const ticket_id = req.params.ticket_id
		let total = 0

		let ticket = await Ticket.findById(ticket_id).populate('cash_pays card_pays transfers checks')
		if (!ticket) throw Error('Ticket not found')

		let check = new Check(req.body)
		check.subsidiary = subsidiary_id
		check.ticket = ticket_id

		ticket.payed = calculatePays(ticket, check.amount)

		ticket.checks.push(check._id)
		await ticket.save()
		check = await check.save()

		sendJSONresponse(res, 201, {payed: ticket.payed, check})

	} catch(e) {
		return next(e)
	}
}


module.exports = {
	check_create
}