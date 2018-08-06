'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config/config')
const sendJSONresponse = require('./shared').sendJSONresponse
const mailer = require('../utils/email')
const openpay = require('../utils/openpay')

function generateToken(user) {
    return jwt.sign(user, config.secret, {})
}

function setUserInfo(user) {
    const userInfo = {
        _id: user._id,
        email: user.email,
        full_name: user.full_name,
        address: user.address,
        state: user.state,
        postal_code: user.postal_code,
        city: user.city,
        phone_number: user.phone_number,
        role: user.role,
        subsidiary: user.subsidiary
    }

    return userInfo
}

function login(req, res, next) {
    let userInfo = setUserInfo(req.user)

    sendJSONresponse(res, 200, {
        token: generateToken(userInfo),
        user: userInfo
    })
}


async function register(req, res, next) {
    try {
        let userExist = await User.findOne({email: req.body.email})

        if (userExist) {
            return next(new Error('User alredy exist'))
        }

        let user = new User(req.body)

        if (user.role === 'User') {
            let user_openpay = {
                'name': user.full_name,
                'email': user.email,
                'address': {
                  'line1': user.address,
                  'country_code': 'MX',
                  'state': user.state,
                  'city': user.city,
                  'postal_code': user.postal_code
                }
              }
      
              openpay.customers.create(user_openpay, async (error, customer) => {
                if (error) throw Error(error)
      
                user.openpay_id = customer.id
                user = await user.save()
      
                let userInfo = setUserInfo(user)
      
                //mailer.send_welcome(user.email, user.full_name)
      
                sendJSONresponse(res, 200, {
                    token: generateToken(userInfo),
                    user: userInfo
                })
              })
        } else {
            user = await user.save()
      
            let userInfo = setUserInfo(user)
      
            sendJSONresponse(res, 200, {
                token: generateToken(userInfo),
                user: userInfo
            })
        }
        //user = await user.save()

    } catch (e) {
        next(e)
    }
}

module.exports = {
    login,
    register
}
