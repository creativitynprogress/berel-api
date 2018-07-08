const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    full_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enable: {
        type: Boolean,
        default: true
    },
    subsidiary: {
        type: Schema.Types.ObjectId, ref: 'Subsidiary'
    },
    role: {
        type: String,
        enum: ['Manager', 'Sales'],
        default: 'Sales'
    }
}, {
    timestamps: true,
    versionKey: false
})

employeeSchema.pre('save', function (next) {
    const SALT_FACTOR = 5
    const owner = this

    if (!owner.isModified('password')) return next()

    const salt = bcrypt.genSaltSync(SALT_FACTOR)
    const hash = bcrypt.hashSync(owner.password, salt)

    owner.password = hash
    next()
})

//  Method to compare password for login
employeeSchema.methods.comparePassword = function (candidatePassword, cb) {
    const isMatch = bcrypt.compareSync(candidatePassword, this.password)
    cb(null, isMatch)
}

module.exports = mongoose.model('Employee', employeeSchema)
