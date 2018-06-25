const sendJSONresponse = require('./shared').sendJSONresponse
const User = require('../models/user')

async function user_update (req, res, next) {
	try {
		const user = req.user

		let user = await User.findByIdAndUpdate(user._id, req.body, { new: true })

		sendJSONresponse(res, 200, user)
	} catch(e) {
		return next(e)
	}
}

async function reset_password (req, res, next) {
	try {
		const user = req.user

		sendJSONresponse(res, 200, 'ok')
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	user_update,
	reset_password
}
