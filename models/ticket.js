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
}, { usePushEach: true })

const baseItem = new Schema({
  line: { type: String },
  product_id: { type: String },
  presentation: { type: String },
  quantity: { type: Number, min: 1 },
  price: { type: Number },
  description: { type: String }
}, { usePushEach: true })

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
}, { usePushEach: true })


const ticketSchema = new Schema({
    paints: [paintItem],
    products: [productItem],
    bases: [baseItem],
    seller: { type: Schema.Types.ObjectId, ref: 'Employee'},
    cash_pays: [{ type: Schema.Types.ObjectId, ref: 'CashPayment'}],
    card_pays: [{ type: Schema.Types.ObjectId, ref: 'CardPayment'}],
    transfers: [{ type: Schema.Types.ObjectId, ref: 'Transfer'}],
    checks: [{type: Schema.Types.ObjectId, ref: 'Check'}],
    total: {type: Number, required: true},
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary'},
    date: { type: Number, required: true },
    payed: { type: Boolean, default: false },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    boxcut: { type: Schema.Types.ObjectId, ref: 'BoxCut' },
    discount: {
        quantity: { type: Number, default: 0 },
        percentage: { type: Number }
    },
    invoice: {
        state: { type: String, enum: ['pending', 'no', 'invoiced'], default: 'no' },
        reason: { type: String }
    },
    folio: { type: String, required: true}
}, {
    timestamps: true,
    versionKey: false,
    usePushEach: true
})

module.exports = {
    ticket: mongoose.model('Ticket', ticketSchema)
}
