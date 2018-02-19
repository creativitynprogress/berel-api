const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkSchema = new Schema({
	ticket: { type: Schema.Types.ObjectId, ref: 'Ticket'},
	amount: { type: Number, min: 0, required: true}
})

module.exports = mongoose.model('Check', checkSchema)
