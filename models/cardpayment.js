const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardPaymentSchema = new Schema({
    card: { type: Schema.Types.ObjectId , ref: 'Card', required: true },
    amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
    ticket: {type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    date: { type: Number, required: true }
}, {
    versionKey: false
})

module.exports = mongoose.model('CardPayment', cardPaymentSchema)
