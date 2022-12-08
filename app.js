const dotenv = require('dotenv')
dotenv.config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require("cookie-session")
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const bcrypt = require('bcryptjs')
const { body, validationResult, check } = require('express-validator')
const async = require("async")
const uuid = require('uuid')
const cors = require('cors')

const indexRouter = require('./routes/index')

const Post = require('./models/post')
const Comment = require('./models/comment')
const User = require('./models/user')

const app = express()

post_count = function(callback) {
    Post.countDocuments({}, callback)
}

comment_count = function(callback) {
    Comment.countDocuments({}, callback)
}
    
user_count = function(callback) {
    User.countDocuments({}, callback)
}

app.use((req, res, next) => {
    const data = dataCount()
    req.context = {
        me: data,
    }
    next()
})

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

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
/*app.use((req, res, next) => {
    req.context = {
        posts,
        me: models.posts[0]
    }
    next()
})*/
app.use(bodyParser.json())

app.use('/', indexRouter)

app.post(
    '/login', 
    passport.authenticate("local", {
        successRedirect: '/success-login',
        failureRedirect: '/failed-login'
    })
)

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