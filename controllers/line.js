const Line = require('../models/line')
const sendJSONresponse = require('./shared').sendJSONresponse
const boom = require('boom')

async function line_create(req, res, next) {
    try {
        let line = new Line(req.body)

        line = await line.save()

        sendJSONresponse(res, 201, line)
    } catch (e) {
        return next(e)
    }
}

async function line_update(req, res, next) {
    try {
        const line_id = req.params.lineId

        let line = await Line.findById(line_id)
        if (!line) throw boom.notFound('line not found')

        line = Object.assign(line, req.body)

        line = await line.save()

        sendJSONresponse(res, 200, line)
    } catch (e) {
        return next(e)
    }
}

async function line_delete(req, res, next) {
    try {
        const line_id = req.params.lineId

        let line = await Line.findByIdAndRemove(line_id)

        sendJSONresponse(res, 200, line)
    } catch (e) {
        return next(e)
    }
}

async function line_list(req, res, next) {
    try {
        let lines = await Line.find({})

        sendJSONresponse(res, 200, lines)
    } catch (e) {
        return next(e)
    }
}


module.exports = {
    line_create,
    line_update,
    line_delete,
    line_list
}
