'use strict'

const Provider = require('../models/provider')
const Subsidiary = require('../models/subsidiary')
const sendJSONresponse = require('./shared').sendJSONresponse
const boom = require('boom')

async function provider_create (req, res, next) {
  try {
    const user = req.user

    let provider = new Provider(req.body)

    if (user.role === 'User') {
			provider.user = user._id
		} else {
			let subsidiary = await Subsidiary.findById(user.subsidiary)
			provider.user = subsidiary.user
		}

    provider = await provider.save()

    sendJSONresponse(res, 201, provider)
  } catch (e) {
    return next(e)
  }
}

async function provider_list (req, res, next) {
  try {
    const user = req.user

    let providers = []
    if (user.role == 'User') {
      providers = await Provider.find({user: user._id})
    } else {
      let subsidiary = await Subsidiary.findById(user.subsidiary)

      providers = await Provider.find({user: subsidiary.user})
    }

    sendJSONresponse(res, 200, providers)
  } catch(e) {
    return next(e)
  }
}

module.exports = {
  provider_create,
  provider_list
}
