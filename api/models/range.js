const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rangeSchema = new Schema({
	line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
    range: { type: String, enum: ['R-1', 'R-2', 'R-3']},
    liter:  { type: Number, required: true },
    gallon: { type: Number, required: true },
    bucket: { type: Number, required: true }
}, {
    versionKey: false
})

module.exports = mongoose.model('Range', rangeSchema)
