var express = require('express');
var router = express.Router();
const async = require('async')
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))

/* GET home page */
router.get('/', (req, res, next) => {
    return res.redirect('/posts')
})

/* Load posts on home page */
router.get('/posts', (req, res, next) => {
    const requestUrl = "http://localhost:3000/api/posts"
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('index.pug', { title: "Home Page", posts: data })
    }) 
})

/* Load specific post poage */
router.get('/posts/:id', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('specific-post.pug', { post: data })
    })
})

/* Load comments for post */
router.get('/posts/:id/comments', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('comments.pug', {title: "Comments", comments: data})
    })
})

/* Load new post form */
router.get('/new-post', (req, res, next) => {
    res.render('new-post.pug', {title: "Create New Post"})
})

/* GET login page */
router.get('/login', (req, res) => {
    return res.render("login.pug", { title: "Log In" })
})

/* GET signup page */
router.get('/sign-up', (req, res) => {
    return res.render('sign-up.pug', { title: "Sign Up" })
})

/* GET failed login page */
/// CHANGE THIS SO USERS CAN'T ACCESS IT MANUALLY ///
router.get('/failed-login', (req, res) => {
    return res.render('failed-login.pug', { title: "Log-in Attempt Failed" })
})

/* GET successful login page */
/// REMOVE THIS LATER ///
router.get('/success-login', (req, res) => {
    return res.render('success-login.pug')
})

module.exports = router