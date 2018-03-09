const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supplierSchema = new Schema ({

    name: {type: String, required: true },
    address: {type: String },
    rfc: {type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }
},
{
    timestamps: true,
    versionKey: false
})


  module.exports = mongoose.model('Supplier', supplierSchema)
