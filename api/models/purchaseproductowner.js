const mongoose = require('mongoose')
const Schema = mongoose.Schema

const purchase = new Schema({
	product: {type: Schema.Types.ObjectId, ref: 'ProductOwner'},
	quantity: {type: Number, required: true},
	total: {type: Number, required: true}
})

const purchaseProductOwner = new Schema({
	products: [purchase],
	subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
	date: {type: Number, required: true}
})

module.exports = mongoose.model('PurchaseProductOwner', purchaseProductOwner)
