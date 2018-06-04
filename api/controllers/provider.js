'use strict'

const Provider = require('../models/provider')
const sendJSONresponse = require('./shared').sendJSONresponse
const boom = require('boom')

async function provider_create (req, res, next) {
  try {
    const user = req.user

    let provider = new Provider(req.body)
    provider.user = user._id

    provider = await provider.save()

    sendJSONresponse(res, 201, provider)
  } catch (e) {
    return next(e)
  }
}

async function provider_list (req, res, next) {
  try {
    const user = req.user

    let providers = await Provider.find({user: user._id})

    sendJSONresponse(res, 200, providers)
  } catch(e) {
    return next(e)
  }
}

module.exports = {
  provider_create,
  provider_list
}
