const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lineSchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Line', lineSchema)
