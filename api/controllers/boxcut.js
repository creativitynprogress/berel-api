const sendJSONresponse = require('./shared').sendJSONresponse
const Boxcut = require('../models/boxcut')
const Ticket = require('../models/ticket')

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
	boxcut_list
}