const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticketItem = new Schema({
    quantity: { type: Number, required: true, min: 1},
    name: { type: String },
    presentation: { type: String },
    price: { type: Number },
    paint: { type: Schema.Types.ObjectId, ref: 'Paint' },
    product: { type: Schema.Types.ObjectId, ref: 'Product'}
})

const paySchema = new Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true }
})

const ticketSchema = new Schema({
    items: [ticketItem],
    pays: [paySchema],
    total: {type: Number, required: true},
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'}
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Ticket', ticketSchema)
