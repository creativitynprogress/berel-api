const mongoose = require('mongoose')
const Schema = mongoose.Schema

const providerSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Provider', providerSchema)
