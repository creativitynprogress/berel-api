const sendJSONresponse = require('./shared').sendJSONresponse
const User = require('../models/user')

async function employees_list (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiary_id

		let employees = await User.find({subsidiary: subsidiary_id})

		sendJSONresponse(res, 200, employees)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	employees_list
}