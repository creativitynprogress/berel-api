const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
	name: { type: String },
	rfc: { type: String },
	address: { type: String },
	email: { type: String },
	phone: { type: Number },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true } 
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Client', clientSchema)
