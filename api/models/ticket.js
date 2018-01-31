const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paintItem = new Schema({
    line: {type: String},
    color: {type: String},
    presentation: {type: String},
    base: {type: String},
    quantity: {type: Number, min: 1},
    price: {type: Number},
    paint: {type: Schema.Types.ObjectId, ref: 'Paint'}
})

const productItem = new Schema({
    product_id: {type: String},
    po: { type: String },
    sp: { type: String },
    unit: { type: String },
    quantity: { type: String },
    bar_code: { type: String },
    description: { type: String },
    brand: { type: String },
    price: { type: Number }
})

const paySchema = new Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true }
})

const ticketSchema = new Schema({
    paints: [paintItem],
    products: [productItem],
    pays: [paySchema],
    total: {type: Number, required: true},
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
    date: { type: Number, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    boxcut: { type: Schema.Types.ObjectId, ref: 'BoxCut' }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Ticket', ticketSchema)
