var express = require('express');
var router = express.Router();
const async = require('async')

/* GET home page */
router.get('/', (req, res, next) => {
    return res.redirect('/posts')
})

/* Load posts on home page */
router.get('/posts', (req, res, next) => {
    return res.render('index.pug')
})