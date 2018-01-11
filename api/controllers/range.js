const Range = require('../models/range')
const Serie = require('../models/line')
const sendJSONresponse = require('./shared').sendJSONresponse

async function range_create(req, res, next) {
  try {
    const line_id = req.params.lineId
    let range = new Range(req.body)
    range.line = line_id

    range = await range.save()

    sendJSONresponse(res, 201, range)
  } catch(e) {
    return next(e)
  }
}

async function range_by_line(req, res, next) {
  try {
    const line_id = req.params.lineId

    let ranges = await Range.find({line: line_id})

    sendJSONresponse(res, 200, ranges)
  } catch(e) {
    return next(e)
  }
}

async function range_update(req, res, next) {
  try {
    const range_id = req.params.rangeId

    let range = await Range.findByIdAndUpdate(range_id, req.body, {new: true})

    sendJSONresponse(res, 200, range)
  } catch(e) {
    return next(e)
  }
}

async function range_delete(req, res, next) {
  try {
    const range_id = req.params.rangeId

    let range = await Range.findByIdAndRemove(range_id)

    sendJSONresponse(res, 200, range)
  } catch(e) {
    return next(e)
  }
}

module.exports = {
  range_create,
  range_by_line,
  range_update,
  range_delete
}
