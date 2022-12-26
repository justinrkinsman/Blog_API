var express = require('express');
var router = express.Router();
const async = require('async');
const { body } = require('express-validator');
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

/* Load specific post page */
router.get('/posts/:id', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('specific-post.pug', { post: data[0], comments: data[1] })
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

/* Load new comment page */
router.get('/posts/:id/new-comment', (req, res, next) => {
    res.render('new-comment.pug', {title:"Add Comment"})
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
        return res.redirect('/posts')
    })
})

/* Add comment to post */
router.post('/posts/:id/new-comment', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments`
    fetch(requestUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"body": req.body.comment})
    })
    .then(response => response.json())
    .then(data => {
        return res.redirect(`/posts/${req.params.id}/comments`)
    })
})

/* Load specific post page */
router.get('/posts/:id/comments/:commentId', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('specific-comment.pug', { title: "Comment Info", comment: data })
    })
})

/* GET edit post page */
router.get('/posts/:id/edit-post', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/edit-post`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render(`edit-post.pug`, {title: "Edit Post", post: data})
    })
})

/* Edit post */
router.post('/posts/:id/edit-post', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
    
    fetch(requestUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"title": req.body.title, "body": req.body.body})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success', data)
    })
    .catch((error) => {
        console.log('Error', error)
    })
    res.redirect(`/posts/${req.params.id}`)
})

/* GET edit commment page */
router.get('/posts/:id/comments/:commentId/edit-comment', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render(`edit-comment.pug`, {title: "Edit Comment", comment: data})
    })
})

/* GET login page */
router.get('/login', (req, res) => {
    return res.redirect('/')
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