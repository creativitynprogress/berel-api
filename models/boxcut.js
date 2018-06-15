const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boxcutSchema = new Schema({
	tickets: [{type: Schema.Types.ObjectId, ref: 'Ticket'}],
	date: { type: Number, required: true},
	subsidiary: { type: Schema.Types.ObjectId, required: true },
	total: { type: Number },
	cash_pays: { type: Number },
	card_pays: { type: Number }
})

module.exports = mongoose.model('BoxCut', boxcutSchema)