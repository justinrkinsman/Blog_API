var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/* Load main page */
router.get('/', (req, res, next) => {
    return res.redirect('/admin/login')
})

/* GET admin site page */
router.get('/login', (req, res, next) => {
    return res.render('admin-login.pug')
})

///Add post, user, and comment count to this page
router.get('/dashboard', async (req, res) => {
    if (req.user.admin !== true) {
        return res.redirect('/admin/failed-login')
    }
    if (req.user.admin === true) {
        const requestUrl = "http://localhost:3000/api/posts"
        fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            if (req.user.admin === true) {
                return res.render('admin-dashboard.pug', {title: 'Admin Page', posts: data})
            }
        }) 
    } 
})

router.get('/failed-login', (req, res) => {
    return res.render('admin-fail.pug')
})

/* Load new post form */
router.get('/new-post', (req, res, next) => {
    res.render('new-post.pug', {title: "Create New Post"})
})

/* Create new post */
router.post('/new-post', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts`
    fetch(requestUrl, {
        method: "POST",
        // Try adding this later mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "title": req.body.title, 
            "body": req.body.body, 
            "published": true })
    })
    .then(response => response.json())
    .then(data => {
        return res.redirect('/admin/dashboard')
    })
})

module.exports = router