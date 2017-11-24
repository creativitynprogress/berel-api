'use strict'

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/user')
const config = require('../config/config')
const sendJSONresponse = require('./shared').sendJSONresponse

function generateToken(user) {
    return jwt.sign(user, config.secret, {})
}

function setUserInfo(user) {
    const userInfo = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
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

        user = await user.save()
        let userInfo = setUserInfo(user)

        sendJSONresponse(res, 200, {
            token: generateToken(userInfo),
            user: userInfo
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    login,
    register
}