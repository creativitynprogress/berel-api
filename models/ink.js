const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inkSchema = new Schema({
	product_id: { type: String },
	bar_code: {type: String},
	price: {type: Number, required: true},
	description: { type: String, required: true, unique: true }
})

module.exports = mongoose.model('Ink', inkSchema)
