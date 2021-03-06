const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transferSchema = new Schema({
	ticket: {type: Schema.Types.ObjectId, ref: 'Ticket'},
	amount: {type: Number, min: 0, required: true},
	reference: {type: Number, required: true},
	folio: {type: Number, required: true}
})

module.exports = mongoose.model('Transfer', transferSchema)
