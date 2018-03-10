const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkSchema = new Schema({
	ticket: { type: Schema.Types.ObjectId, ref: 'Ticket'},
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary'},
	amount: { type: Number, min: 0, required: true},
	date: {type: Number, required: true},
	check_number: {type: String, required: true}
})

module.exports = mongoose.model('Check', checkSchema)
