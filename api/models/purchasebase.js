const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchaseBaseSchema = new Schema({
	base: { type: Schema.Types.ObjectId, ref: 'Base'},
	subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
	quantity: { type: Number, min: 0},
	date: { type: Number }
})

module.exports = mongoose.model('PurchaseBase', purchaseBaseSchema)
