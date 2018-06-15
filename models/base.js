const mongoose = require('mongoose')
const Schema = mongoose.Schema

const baseSchema = new Schema({
	line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
	presentation: { type: String, enum: ['1L', '4L', '19L'], required: true },
	base: { type: String },
	product_id: { type: String, required: true },
	bar_code: { type: String },
	price: { type: Number, required: true},
	can_sell: { type: Boolean, default: false },
	//Quizas no se use suggestedPrice
	suggestedPrice: { type: Number },
	description: { type: String }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Base', baseSchema)
