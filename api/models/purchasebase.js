const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchase = new Schema ({
	base: { type: Schema.Types.ObjectId, ref: 'Base'},
	quantity: { type: Number, min: 1},
	total: { type: Number, required: true }
})

const purchaseBaseSchema = new Schema({
	bases: [purchase],
	subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
	date: { type: Number }
})

module.exports = mongoose.model('PurchaseBase', purchaseBaseSchema)
