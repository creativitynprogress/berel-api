const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subsidiaryRangeSchema = new Schema({
	line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
	range: { type: Schema.Types.ObjectId, ref: 'Range', required: true },
	subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true },
	liter: { type: Number },
	gallon: { type: Number },
	bucket: { type: Number }
})

module.exports = mongoose.model('SubsidiaryRange', subsidiaryRangeSchema)
