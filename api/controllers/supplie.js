const Supplie = require('../models/supplie')
const sendJSONresponse = require('./shared').sendJSONresponse

async function supplie_create(req, res, next) {
    try {
        const user = req.user

        let supplie = new Supplie(req.body)
        supplie.user = user._id

        supplie = await supplie.save()

        sendJSONresponse(res, 201, supplie)
    } catch(e) {
        return next(e)
    }
}

async function supplie_update(req, res, next) {
    try {
        const user = req.user
        const supplie_id = req.params.supplieId

        let supplie = await Supplie.findById(supplie_id)
        if (supplie) {
            supplie = Object.assign(supplie, req.body)
            sendJSONresponse(res, 200, supplie)
        } else {
            return next(new Error('suplieId invalid'))
        }
    } catch(e) {
        return next(e)
    }
}

async function supplie_delete(req, res, next) {
    try {
        const supplie_id = req.params.supplieId

        let supplie = await Supplie.findByIdAndRemove(supplie_id)

        sendJSONresponse(res, 200, supplie)
    } catch(e) {
        return next(e)
    }
}

async function supplie_list(req, res, next) {
    try {
        const user = req.user

        let supplies = await Supplie.find({user: user._id})

        sendJSONresponse(res, 200, supplies)
    } catch(e) {
        return next(e)
    }
}

module.exports = {
    supplie_create,
    supplie_update,
    supplie_delete,
    supplie_list
}