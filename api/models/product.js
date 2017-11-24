const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    elements: [Schema.Types.ObjectId],
    user: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)
