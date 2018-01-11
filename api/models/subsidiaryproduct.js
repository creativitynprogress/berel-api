const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subsidiaryProductSchema = new Schema({
	product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true },
	salePrice: { type: Number, required: true },
	stock: { type: Number }
})

module.exports = mongoose.model('SubsidiaryProduct', subsidiaryProductSchema)
