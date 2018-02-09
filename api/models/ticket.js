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
  pays_card: [{
        card: {type: Schema.ObjectId, ref: 'Card', required: true},
        amount: { type: Number, required: true }
  }],
  pays_cash: [{amount: {type: Number, required: true}}],
  pays_check: [{
    name: {type: String, required: true },
    number_check: { type: String, required: true },
    amount: {type: Number, required: true },
    date: { type: Number, required: true }
  }],
  pays_transfer: [{
    number_reference: { type: Number, required: true },
    date: { type: Number, required: true },
    folio: { type: String, required: true },
    tracking_key: { type: String, required: true }
  }]
})


const ticketSchema = new Schema({
    paints: [paintItem],
    products: [productItem],
    cash_pays: [{ type: Schema.Types.ObjectId, ref: 'CashPayment'}],
    card_pays: [{ type: Schema.Types.ObjectId, ref: 'CardPayment'}],
    total: {type: Number, required: true},
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
    date: { type: Number, required: true },
    payed: { type: Boolean, default: false },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    boxcut: { type: Schema.Types.ObjectId, ref: 'BoxCut' }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = {
    ticket: mongoose.model('Ticket', ticketSchema),
    pays: mongoose.model('Pays', paySchema)
}