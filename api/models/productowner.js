const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productOwnerSchema = new Schema({
  subsidiary: { type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true },
  product_id: { type: String, unique: true },
  bar_code: { type: String },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String },
  salePrice: { type: Number, required: true },
  unit: { type: String, enum: ['SCO25', 'SCO5', 'BL2', 'BL5', 'SCO20', 'GL', 'PZA', 'CB', 'GL']},
  stock : { type: Number, min: 0 }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('ProductOwner', productOwnerSchema)