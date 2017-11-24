const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supplieSchema = new Schema({
    name: String,
    unit: {
        type: String,
        enum: ['g', 'ml', 'pza']
    },
    category: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Supplie', supplieSchema)
