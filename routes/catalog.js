var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args))
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
        if (!req.user) {
            return res.render('index.pug', { title: "Home Page", posts: data, user: null })
        }else{
            return res.render('index.pug', { title: "Home Page", posts: data, user: req.user.username})
        }
    }) 
})

/* Load specific post page */
router.get('/posts/:id', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
    fetch(requestUrl, {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        if (!req.user) {
            return res.render('specific-post.pug', { post: data[0], comments: data[1], user: null })
        } else {
            return res.render('specific-post.pug', { post: data[0], comments: data[1], user: req.user.username })
        }
    })
})

/* Load comments for post */
router.get('/posts/:id/comments', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments`
    const user = {}
    fetch(requestUrl)
    .then(response => response.json())
    .then(async data => {
        return res.render('comments.pug', {title: "Comments", comments: data})
    })
})

/* Load new comment page */
router.get('/posts/:id/new-comment', (req, res, next) => {
    res.render('new-comment.pug', {title:"Add Comment", user: req.user.username})
})

/* Add comment to post */
router.post('/posts/:id/new-comment', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments`
    fetch(requestUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"body": req.body.comment, "user": req.user.username})
    })
    .then(response => response.json())
    .then(data => {
        return res.redirect(`/posts/${req.params.id}/comments`)
    })
})

/* Load specific comment */
router.get('/posts/:id/comments/:commentId', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('specific-comment.pug', { title: "Comment Info", comment: data })
    })
})

/* Edit Comment */
router.post('/posts/:id/comments/:commentId/edit-comment', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    
    fetch(requestUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"body": req.body.body})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success', data)
    })
    .catch((error) => {
        console.log('Error', error)
    })
    res.redirect(`/posts/${req.params.id}/comments/${req.params.commentId}`)
})

/* DELETE comment */
router.post('/posts/:id/comments/:commentId/delete-comment', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success', data)
    })
    .catch((error) => {
        console.log('Error', error)
    })
    res.redirect(`/posts/${req.params.id}/comments`)
})

/* GET edit commment page */
router.get('/posts/:id/comments/:commentId/edit-comment', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render(`edit-comment.pug`, {title: "Edit Comment", comment: data})
    })
})

/*
router.get('/posts/:id/edit-post', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/edit-post`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render(`edit-post.pug`, {title: "Edit Post", post: data})
    })
})
*/

/* GET delete comment page */
router.get('/posts/:id/comments/:commentId/delete-comment', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('delete-comment.pug', {title: "Delete Comment", comment: data})
    })
})

/* GET login page */
router.get('/login', (req, res) => {
    res.render('login.pug', { title: "Login" })
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
router.get('/success-login', (req, res) => {
    return res.redirect('/')
})

module.exports = router