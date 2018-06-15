const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inkSchema = new Schema({
	name: { type: String, required: true, unique: true},
	product_id: { type: String },
	bar_code: {type: String},
	price: {type: Number, required: true},
	description: { type: String }
})

module.exports = mongoose.model('Ink', inkSchema)
