const passport = require("passport")
const User = require("../models/user")
const Employee = require('../models/employee')
const config = require("./config")
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const localOptions = {
  usernameField: "email",
  passwordField: "password"
};

// Setting up local login Strategy
const localLogin = new LocalStrategy(localOptions, async function(email, password, done) {
  try {
    let user_exist = await User.findOne({email: email})

    if (user_exist) {
      user_exist.comparePassword(password, (err, isMatch) => {
        if (err) return done(err)

        if (!isMatch) {
          return done(null, false, { error: 'Your login details could not be verified. Please try again.'})
        }

        return done(null, user_exist)
      })
    } else {
      let employee_exist = await Employee.findOne({email: email})

      if (employee_exist) {
        employee_exist.comparePassword(password, (err, isMatch) => {
          if (err) return done(err)

          if (!isMatch) {
            return done(null, false, { error: 'Your login details could not be verified. Please try again.'})
          }

          return done(null, employee_exist)
        })
      } else {
        return done(null, false, { error: 'Your login details could not be verified. Please try again.'})
      }
    }

  } catch(e) {
    return done(e)
  }
});

//  Setting JWT strategy options
const jwtOptions = {
  //  Telling Passport to check authorization headers for jwt
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //  Telling passport where to find the secret
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    let user = await User.findById(payload._id)

    if (user) {
      done(null, user)
    } else {
      let employee = await Employee.findById(payload._id)

      done(null, employee)
    }
  } catch (e) {
    return done(e)
  }
})

passport.use(jwtLogin);
passport.use(localLogin);
