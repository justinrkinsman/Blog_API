var express = require('express');
var router = express.Router();
const async = require('async')

/* GET home page */
router.get('/', (req, res, next) => {
    return res.redirect('/posts')
})

/* Load posts on home page */
router.get('/posts', (req, res, next) => {
    return res.render('index.pug', {title: "Home Page"})
})

/* GET login page */
router.get('/login', (req, res) => {
    return res.render("login.pug", { title: "Log In" })
})

module.exports = router