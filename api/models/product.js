const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  product_id: { type: String, unique: true },
  bar_code: { type: String },
  description: { type: String, required: true },
  category: { type: String },
  suggestedPrice: { type: Number, required: true },
  unit: { type: String, enum: ['GL', 'CB', 'LT', 'PZA']}
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Product', productSchema)
