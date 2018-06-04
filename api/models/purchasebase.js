const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseBase = new Schema ({
	base: { type: Schema.Types.ObjectId, ref: 'Base'},
	quantity: { type: Number, min: 1},
	total: { type: Number, required: true }
})

const purchaseInk = new Schema({
	ink: { type: Schema.Types.ObjectId, ref: 'Ink'},
	quantity: {type: Number, min: 1},
	total: {type: Number, required: true}
})

const purchaseSchema = new Schema({
	bases: [purchaseBase],
	inks: [purchaseInk],
	subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
	date: { type: Number }
})

module.exports = mongoose.model('Purchase', purchaseSchema)
