const sendJSONresponse = require('./shared').sendJSONresponse
const Ink = require('../models/ink')

async function ink_create (req, res, next) {
	try {

		let ink = new Ink(req.body)

		ink = await ink.save()

		sendJSONresponse(res, 201, ink)

	} catch(e) {
		return next(e)
	}
}

async function ink_list (req, res, next) {
	try {

		let inks = await Ink.find({})

		sendJSONresponse(res, 200, inks)

	} catch(e) {
		return next(e)
	}
}

async function ink_delete (req, res, next) {
	try {
		const ink_id = req.params.ink_id

		let ink = await Ink.findByIdAndRemove(ink_id)

		sendJSONresponse(res, 200, ink)

	} catch(e) {
		return next(e)
	}
}

module.exports = {
	ink_create,
	ink_list,
	ink_delete
}