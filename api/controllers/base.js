const sendJSONresponse = require('./shared').sendJSONresponse
const Base = require('../models/base')

async function base_create(req, res, next) {
	try {
		let base = new Base(req.body)

		base = await base.save()
		base = await Base.populate(base, 'line')

		sendJSONresponse(res, 201, base)
	} catch(e) {
		return next(e)
	}
}

async function base_list(req, res, next) {
	try {
		bases = await Base.find({}).populate('line')

		sendJSONresponse(res, 200, bases)
	} catch(e) {
		return next(e)
	}
}

async function base_update(req, res, next) {
	try {
		let base_id = req.params.baseId

		let base = await Base.findByIdAndUpdate(base_id, req.body, {new: true}).populate('line')

		sendJSONresponse(res, 200, base)
	} catch(e) {
		return next(e)
	}
}

async function base_delete(req, res, next) {
	try {
		let base_id = req.params.baseId

		let base = await Base.findByIdAndRemove(base_id)

		sendJSONresponse(res, 200, base)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	base_create,
	base_list,
	base_update,
	base_delete
}