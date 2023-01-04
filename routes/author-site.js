var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* GET admin site page */
router.get('/', (req, res, next) => {
    return res.render('admin-login.pug')
})

module.exports = router