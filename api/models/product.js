const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  product_id: { type: String, unique: true },
  bar_code: { type: String },
  brand: {type: String, default: 'Berel' },
  description: { type: String, required: true },
  category: { type: String },
  suggestedPrice: { type: Number, required: true },
  unit: { type: String, enum: ['SCO25', 'SCO5', 'BL2', 'BL5', 'SCO20', 'GL', 'PZA', 'CB', 'GL']}
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Product', productSchema)
