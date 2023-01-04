var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* GET admin site page */
router.get('/login', (req, res, next) => {
    return res.render('admin-login.pug')
})

router.get('/success-login', (req, res) => {
    return res.render('admin-success.pug', {title: 'Admin Page'})
})

router.get('/failed-login', (req, res) => {
    return res.render('admin-fail.pug')
})

/* POST admin login */
/*router.post('/', (req, res, next) => {

})*/

module.exports = router