const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema({
    supplie: {
        type: Schema.Types.ObjectId,
        required: true
    },
    unit: {
        type: String
    },
    quantity: {
        type: Number
    }
})

module.exports = mongoose.model('Element', elementSchema)
