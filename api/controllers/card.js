const sendJSONresponse = require('./shared').sendJSONresponse
const Card = require('../models/card')

async function card_create(req, res, next) {
	try {
		const user = req.user

		let card = new Card(req.body)
		card.user = user._id

		card = await card.save()

		sendJSONresponse(res, 200, card)
	} catch(e) {
		return next(e)
	}
}

async function card_list(req, res, next) {
	try {
		const user = req.user

		let cards = await Card.find({user: user._id})

		sendJSONresponse(res, 200, cards)
	} catch(e) {
		return next(e)
	}
}

async function card_delete(req, res, next) {
	try {
		const card_id = req.params.cardId

		let card = await Card.findByIdAndRemove(card_id)

		sendJSONresponse(res, 200, card)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	card_create,
	card_list,
	card_delete
}
