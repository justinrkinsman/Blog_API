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

/* Load specific post page */
router.get('/posts/:id', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
    fetch(requestUrl, {
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        return res.render('admin-specific-post.pug', {post: data[0], comments: data[1]})
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
    res.redirect(`/admin/post/${req.params.id}`)
})

/* GET delete post page */
router.get('/posts/:id/delete-post', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/delete-post`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('delete-post.pug', {title: "Delete Post", post: data})
    })
})

/* DELETE post */
router.post('/posts/:id/delete-post', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}`
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
    res.redirect('/admin/dashboard')
})

/* Load comments for post */
router.get('/posts/:id/comments', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments`
    const user = {}
    fetch(requestUrl)
    .then(response => response.json())
    .then(async data => {
        return res.render('admin-comments.pug', {title: "Comments", comments: data})
    })
})

/* Load new comment page */
router.get('/posts/:id/new-comment', (req, res, next) => {
    res.render('admin-new-comment.pug', {title:"Add Comment", user: req.user.username})
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
        return res.redirect(`/admin/posts/${req.params.id}/comments`)
    })
})

/* Load specific comment */
router.get('/posts/:id/comments/:commentId', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('admin-specific-comment.pug', { title: "Comment Info", comment: data })
    })
})

/* GET edit commment page */
router.get('/posts/:id/comments/:commentId/edit-comment', (req, res, next) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render(`admin-edit-comment.pug`, {title: "Edit Comment", comment: data})
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
    res.redirect(`/admin/posts/${req.params.id}/comments/${req.params.commentId}`)
})

/* GET delete comment page */
router.get('/posts/:id/comments/:commentId/delete-comment', (req, res) => {
    const requestUrl = `http://localhost:3000/api/posts/${req.params.id}/comments/${req.params.commentId}`
    fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        return res.render('admin-delete-comment.pug', {title: "Delete Comment", comment: data})
    })
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
    res.redirect(`/admin/posts/${req.params.id}/comments`)
})

module.exports = router