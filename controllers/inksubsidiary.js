const sendJSONresponse = require('./shared').sendJSONresponse
const InkSubsidiary = require('../models/inksubsidiary')

async function is_list(req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let inks_subsidiary = await InkSubsidiary.find({subsidiary: subsidiary_id}).populate('ink')

		sendJSONresponse(res, 200, inks_subsidiary)
	} catch(e) {
		return next(e)
	}
}

async function is_update(req, res, next) {
	try {
		const is_id = req.params.is_id

		let is = await InkSubsidiary.findByIdAndUpdate(is_id, req.body, {new: true}).populate('ink')

		sendJSONresponse(res, 200, is)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	is_list,
	is_update
}