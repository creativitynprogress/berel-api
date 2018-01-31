const mongoose = require('mongoose')
const Schema = mongoose.Schema

const elementSchema = new Schema({
    ink: { type: String, required: true },
    ounce: { type: Number },
    ouncePart: { type: Number }
})

const presentationSchema = new Schema({
  name: { type: String, enum: ['1L', '4L', '19L'] },
  elements: [elementSchema]
})

const paintOwnerSchema = new Schema({
    color: { type: String, required: true },
    presentations: [presentationSchema],
    base: { type: String},
    line: { type: Schema.Types.ObjectId, ref: 'Line', required: true },
    range: { type: Schema.Types.ObjectId, ref: 'Range', required: true },
    enable: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Paint', paintOwnerSchema)

//Si se quieren agregar pinturas que no son de Berel, 
//estas se deben emparejar con una línea y un rango, no pueden cambiar de precio.