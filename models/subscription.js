const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriptionSchema = new Schema({
    id: { type: String },
    description: { type: String },
    price: { type: Number },
    type: { type: String },
    product: { type: String }
}, {
    versionKey: false
})

module.exports = mongoose.model('Subscription', subscriptionSchema)
