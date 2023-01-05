var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*function isAdmin(req, res, next) {
    if (req.user.admin === true || req.path==='/admin') {
        return next()
    }
    return res.redirect(403, '/error')
}*/

/* Load main page */
router.get('/', (req, res, next) => {
    return res.redirect('/admin/login')
})

/* GET admin site page */
router.get('/login', (req, res, next) => {
    return res.render('admin-login.pug')
})

router.get('/success-login', async (req, res) => {
    if (req.user.admin === true) {
        return res.render('admin-success.pug', {title: 'Admin Page'})
    }
    return res.redirect('/admin/failed-login')
})

router.get('/failed-login', (req, res) => {
    return res.render('admin-fail.pug')
})

module.exports = router