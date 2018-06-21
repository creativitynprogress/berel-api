const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema({
    ink: { type: String, required: true },
    ounce: { type: Number },
    ouncePart: { type: Number }
}, { usePushEach: true })

const presentationSchema = new Schema({
  name: { type: String, enum: ['1L', '4L', '19L'] },
  elements: [elementSchema]
}, { usePushEach: true })

const paintSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    color: { type: String, required: true },
    presentations: [presentationSchema],
    base: { type: String},
    line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
    range: { type: Schema.Types.ObjectId, ref: 'Range', required: true },
    enable: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false,
    usePushEach: true
})

module.exports = mongoose.model('Paint', paintSchema)
