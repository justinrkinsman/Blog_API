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
const jwt = require('jsonwebtoken')

const indexRouter = require('./routes/index')
const catalog = require('./routes/catalog')
const authorSite = require('./routes/author-site')

const Post = require('./models/post')
const Comment = require('./models/comment')
const User = require('./models/user')

const app = express()

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
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
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
    saveUninitialized: true, }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
/*app.use((req, res, next) => {
    req.context = {
        posts,
        me: models.posts[0]
    }
    next()
})*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', indexRouter)
app.use('/', catalog)
app.use('/admin', authorSite)

app.post(
  '/login', 
  passport.authenticate("local", {
    successRedirect: '/success-login',
    failureRedirect: '/failed-login'
  })
)

app.post(
  '/admin/login',
  passport.authenticate("local", {
    successRedirect: '/admin/success-login',
    failureRedirect: '/admin/failed-login'
  })
)

app.get("/logout", (req, res, next) => {
  req.logout()
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  })
  req.session = null
  res.redirect('/')
})

/* POST sign up page to create new user */
app.post('/sign-up', [
    // Validate and sanitize fields
    body('username')
      .trim()
      .isLength({ min: 1, max: 100 })
      .toLowerCase()
      .escape()
      .withMessage('Username required'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 100 })
      .escape()
      .withMessage("Password is required"),
    check('confirm_password')
      .exists()
      .custom((value, {req}) => value === req.body.password)
      .withMessage('Passwords must match'),
    // Process request after validation and sanitization
    (req, res, next) => {
      const errors = validationResult(req)
  
      // Create a User object with escaped and trimmed data
      const user = new User({
        username: req.body.username.toLowerCase(),
        password: req.body.password,
      })
  
      if (!errors.isEmpty()) {
        res.render('sign-up.pug', {
          title: "Sign Up",
          user: req.user,
          errors: errors.array(),
        })
        return
      } else {
        // Data from form is valid. Check if user with same username exists.
        User.findOne({ username: req.body.username.toLowerCase() }).exec((err, found_username) => {
          if (err) {
            return next(err)
          }
          if (found_username) {
            res.render('sign-up.pug', {info: "Username already in use"})
          } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
              const user = new User({
                username: req.body.username.toLowerCase(),
                password: hashedPassword
              }).save(err => {
                if (err) {
                  return next(err)
                }
                res.redirect('/login')
              })
            })
          }
        })
      }
    }
  ])

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

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))

module.exports = app