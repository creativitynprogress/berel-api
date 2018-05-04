const sendJSONresponse = require('./shared').sendJSONresponse
const BaseSubsidiary = require('../models/basesubsidiary')
const Base = require('../models/base')

async function bs_create(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let bs = new BaseSubsidiary(req.body)
		bs.subsidiary = subsidiary_id

		bs = await bs.save()

		bs = await BaseSubsidiary.populate(bs, {path: 'base', populate: {path: 'line', model: 'Line'}})

		sendJSONresponse(res, 200, bs)

	} catch (e) {
		return next(e)
	}
}

async function bs_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId

		let bs = await BaseSubsidiary.find({subsidiary: subsidiary_id}).populate({path: 'base', populate: {path: 'line', model: 'Line'}})

		sendJSONresponse(res, 200, bs)

	} catch(e) {
		return next(e)
	}
}

async function bs_delete(req, res, next) {
	try {
		const bs_id = req.params.bsId

		let bs = await BaseSubsidiary.findByIdAndRemove(bs_id)

		sendJSONresponse(res, 200, bs)
	} catch(e) {
		return next(e)
	}
}

async function bs_update(req, res, next) {
	try {
		const bs_id = req.params.bsId

		let bs = await BaseSubsidiary.findByIdAndUpdate(bs_id, req.body, {new: true})

		bs = await BaseSubsidiary.populate(bs, {path: 'base', populate: {path: 'line', model: 'Line'}})

		sendJSONresponse(res, 200, bs)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	bs_create,
	bs_list,
	bs_delete,
	bs_update
}