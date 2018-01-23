const Subsidiary = require('../models/subsidiary')
const sendJSONresponse = require('./shared').sendJSONresponse

async function subsidiary_create(req, res, next) {
  try {
    const user = req.user
    if (!req.body.address || !req.body.name) throw Error('address is required.')

    let subsidiary = new Subsidiary(req.body)
    subsidiary.user = req.user._id

    subsidiary = await subsidiary.save()

    sendJSONresponse(res, 201, subsidiary)
  } catch(e) {
    return next(e)
  }
}

async function subsidiary_details(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId

    let subsidiary = await Subsidiary.findById(subsidiary_id)

    sendJSONresponse(res, 200, subsidiary)
  } catch(e) {
    return next(e)
  }
}

async function subsidiary_update(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId

    let subsidiary = await Subsidiary.findByIdAndUpdate(subsidiary_id, req.body, {new: true})

    sendJSONresponse(res, 200, subsidiary)
  } catch (e) {
    return next(e)
  }
}

async function subsidiary_list(req, res, next) {
  try {
    const user = req.user

    let subsidiaries = await Subsidiary.find({user: user._id})

    sendJSONresponse(res, 200, subsidiaries)
  } catch(e) {
    return next(e)
  }
}

async function subsidiary_delete(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiryId

    let subsidiary = await Subsidiary.findByIdAndRemove(subsidiary_id)
    sendJSONresponse(res, 200, subsidiary)
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  subsidiary_create,
  subsidiary_details,
  subsidiary_update,
  subsidiary_list,
  subsidiary_delete
}
