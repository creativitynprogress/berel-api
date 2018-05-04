const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchase = new Schema({
	ink: { type: Schema.Types.ObjectId, ref: 'Ink'},
	quantity: {type: Number, min: 1},
	total: {type: Number, required: true}
})

const purchaseInkSchema = new Schema({
	inks: [purchase],
	subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
	date: { type: Number}
})

module.exports = mongoose.model('PurchaseInk', purchaseInkSchema)
