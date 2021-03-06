const sendJSONresponse = require('./shared').sendJSONresponse
const Boxcut = require('../models/boxcut')
const Ticket = require('../models/ticket').ticket
const Promise = require('bluebird');

async function boxcut_create (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let boxcut = new Boxcut(req.body)
		boxcut.subsidiary = subsidiary_id

		boxcut = await boxcut.save()

		
		boxcut.tickets.map(t => {
			Ticket.findById(t, (err, ticket) => {
				if (ticket) {
					ticket.boxcut = boxcut._id
					ticket.save((err, saved) => {
						console.log(saved)
					})
				}
			})
		})

		sendJSONresponse(res, 201, boxcut)
	} catch(e) {
		return next(e)
	}
}

async function boxcut_details (req, res, next) {
	try {
		const boxcut_id = req.params.boxcutId

		let boxcut = await Boxcut.findById(boxcut_id).populate('tickets')

		sendJSONresponse(res, 200, boxcut)
	} catch (e) {
		return next(e)
	}
}

async function boxcut_request (req, res, next) {
	try {
		const tickets_ids = req.body.tickets

		let cash_pays = 0
		let card_pays = 0
		let checks = 0
		let transfers = 0

		let tickets = await Ticket.find({_id: {$in: tickets_ids}}).populate('cash_pays card_pays checks transfers')

		let results = tickets.map(async (ticket) => {
			if (!ticket.canceled) {
				ticket.cash_pays.map(p => cash_pays += p.amount)
				ticket.card_pays.map(p => card_pays += p.amount)
				ticket.checks.map(p => checks += p.amount)
				ticket.transfers.map(p => transfers += p.amount)
			}
		})

	
		Promise.all(results).then(() => {
			sendJSONresponse(res, 200, {
				cash_pays,
				card_pays,
				checks,
				transfers,
				total: cash_pays + card_pays + checks + transfers
			})
		})
		
	} catch(e) {
		return next(e)
	}
}

async function boxcut_list (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let boxcuts = await Boxcut.find({subsidiary: subsidiary_id})

		sendJSONresponse(res, 200, boxcuts)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	boxcut_create,
	boxcut_list,
	boxcut_details,
	boxcut_request
}