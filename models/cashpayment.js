const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cashPayment = new Schema({
	amount: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subsidiary: {type: Schema.Types.ObjectId, ref: 'Subsidiary', required: true},
    ticket: {type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    date: { type: Number, required: true }
})

module.exports = mongoose.model('CashPayment', cashPayment)
