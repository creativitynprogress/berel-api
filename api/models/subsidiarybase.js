const mongoose = require('mongoose')
const Schema = mongoose.Schema

const baseSubsidiarySchema = new Schema({
	base: { type: Schema.Types.ObjectId, ref: 'Base', required: true },
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
	stock: { type: Number, min: 0 },
	min: { type: Number, default: 0},
	max: { type: Number, default: 100 },
	salePrice: { type: Number }
})

module.exports = mongoose.model('SubsidiaryBase', baseSubsidiarySchema)
