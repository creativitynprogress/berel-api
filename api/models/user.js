const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    enable: {
        type: Boolean
    },
    subsidiary: {
        type: Schema.Types.ObjectId, ref: 'Subsidiary'
    },
    role: {
        type: String,
        enum: ['Owner', 'Admin', 'Manager', 'Sales'],
        default: 'Owner'
    }
}, {
    timestamps: true,
    versionKey: false
})

userSchema.pre('save', function (next) {
    const SALT_FACTOR = 5
    const owner = this

    if (!owner.isModified('password')) return next()

    const salt = bcrypt.genSaltSync(SALT_FACTOR)
    const hash = bcrypt.hashSync(owner.password, salt)

    owner.password = hash
    next()
})

//  Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    const isMatch = bcrypt.compareSync(candidatePassword, this.password)
    cb(null, isMatch)
}

module.exports = mongoose.model('User', userSchema)
