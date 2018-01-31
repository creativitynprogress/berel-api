const sendJSONresponse = require('./shared').sendJSONresponse
const Client = require('../models/client')

async function client_create(req, res, next) {
	try {
		const user = req.user

		let client = new Client(req.body)
		client.user = user._id

		client = await client.save()

		sendJSONresponse(res, 201, client)
	} catch(e) {
		return next(e)
	}
}

async function client_list(req, res, next) {
	try {
		const user = req.user

		let clients = await Client.find({user: user._id})

		sendJSONresponse(res, 200, clients)
	} catch(e) {
		return next(e)
	}
}

async function client_update(req, res, next) {
	try {
		const client_id = req.params.clientId

		let client = await Client.findByIdAndUpdate(client_id, req.body, {new: true})

		sendJSONresponse(res, 200, client)
	} catch(e) {
		return next(e)
	}
}

async function client_delete(req, res, next) {
	try {
		const client_id = req.params.clientId

		let client = await Client.findByIdAndRemove(client_id)

		sendJSONresponse(res, 200, client)
	} catch(e) {
		return next(e)
	}
}

module.exports = {
	client_create,
	client_list,
	client_update,
	client_delete
}
