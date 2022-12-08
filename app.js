const dotenv = require('dotenv')
dotenv.config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require("cookie-session")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcryptjs')
const { body, validationResult, check } = require('express-validator')
const async = require("async")

const indexRouter = require('./routes/index')

const app = express()

app.use('/', indexRouter)

// Set up mongoose connection
const mongoose = require("mongoose")
const dev_db_url = process.env.MONGO_URL
const mongoDB = dev_db_url
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))
mongoose.set('strictQuery', true)  // This may cause problems

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.set('view engine', 'pug');

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username.toLowerCase()}, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" })
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // password match. Log user in
                    return done(null, user)
                } else {
                    // ppasswords do not match
                    return done(null, false, { message: "Incorrect password" })
                }
                return done (null, user)
            })
        })
    })
)

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

app.use(session({
    secret: "superSecretPassword",
    secure: false,
    httpOnly: true,
    sameSite: true,
    maxAge: 24 * 60 * 60 * 1000,
    resave: false,
    saveUnintialized: true, }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error.pug')
})

module.exports = app