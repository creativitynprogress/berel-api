const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema({
    ink: { type: String, required: true },
    ounce: { type: Number },
    ouncePart: { type: Number }
})

const presentationSchema = new Schema({
  name: { type: String, enum: ['1L', '4L', '19L'] },
  base: { type: String},
  elements: [elementSchema]
})

const paintSchema = new Schema({
    color: { type: String, required: true },
    category: { type: String, enum: ['Base agua', 'Esmaltes'], required: true},
    presentations: [presentationSchema],
    line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
    range: { type: Schema.Types.ObjectId, ref: 'Range', required: true },
    enable: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Paint', paintSchema)
