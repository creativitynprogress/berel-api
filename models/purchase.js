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

const purchaseProductOwner = new Schema({
	product: {type: Schema.Types.ObjectId, ref: 'ProductOwner'},
	quantity: {type: Number, min: 1, required: true},
	total: {type: Number, required: true}
})

const paysSchema = new Schema({
	type: { type: String, enum: ['cash', 'card', 'check', 'transfer']},
	amount: { type: Number }
})

const purchaseSchema = new Schema({
	bases: [purchaseBase],
	inks: [purchaseInk],
	products_owner: [purchaseProductOwner],
	pays: [paysSchema],
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true },
	date: { type: Number },
	provider: { type: Schema.Types.ObjectId, ref: 'Provider' }
})

module.exports = mongoose.model('Purchase', purchaseSchema)
