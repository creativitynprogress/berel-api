const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
	terminal: {type: String, enum: ['American Express', 'MasterCard/Visa']},
	type: {type: String, enum: ['debit', 'credit']},
	commision: { type: Number, min: 0, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Card', cardSchema)
