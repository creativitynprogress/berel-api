const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inkSubsidiarySchema = new Schema({
	ink: { type: Schema.Types.ObjectId, ref: 'Ink', required: true},
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
	stock: { type: Number, default: 0, min: 0},
	min: { type: Number, default: 0},
	max: { type: Number, default: 100 }
})

module.exports = mongoose.model('InkSubsidiary', inkSubsidiarySchema)
