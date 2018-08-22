'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Subscription = require('../models/subscription')
const sendJSONresponse = require('./shared').sendJSONresponse
const openpay = require('../utils/openpay')

async function add_card_to_customer (req, res, next) {
  try {
    const user = req.user
    const token_id = req.body.token_id
    const device_session_id = req.body.device_session_id

    const cardRequest = {
      'token_id' : token_id,
      'device_session_id' : device_session_id
    }

    openpay.customers.cards.create(user.openpay_id, cardRequest, (error, card) => {
      if (error) {
        console.log(error)
        sendJSONresponse(res, 402, { error: error.description })
        return
      }

      sendJSONresponse(res, 201, card)
    })
  } catch (e) {
    return next(e)
  }
}

function cards_list (req, res, next) {
  const user = req.user

  openpay.customers.cards.list(user.openpay_id, (error, cards) => {
    if (error) {
      console.log(error)
      sendJSONresponse(res, 402, { error: error.description })
      return
    }

    sendJSONresponse(res, 200, cards)
  })
}

async function subscription_create (req, res, next) {
  try {
    let subscription = new Subscription(req.body)

    subscription = await subscription.save()

    sendJSONresponse(res, 200, subscription)
  } catch (e) {
    return next(e)
  }
}

async function subscription_list (req, res, next) {
  try {
    let subscriptions = await Subscription.find()

    sendJSONresponse(subscriptions)
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  add_card_to_customer,
  cards_list,
  subscription_create,
  subscription_list
}
