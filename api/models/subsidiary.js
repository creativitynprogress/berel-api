const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subsidiarySchema = new Schema({
  name: {type: String, required: true },
  address: { type: String, required: true },
  rfc: { type: String },
  text_ticket: { type: String },
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  subsidiary_number: {type: Number}
})

module.exports = mongoose.model('Subsidiary', subsidiarySchema)
