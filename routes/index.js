var express = require('express');
var router = express.Router();
const async = require('async')
const User = require('../models/user')
const Comment = require('../models/comment')
const Post = require('../models/post')

const users = User.find({}).then((user_count) =>{console.log(`Users: ${user_count}`)})
const comments = Comment.find({}).then((comment_count) =>{console.log(`Comments: ${comment_count}`)})

/// GET Routes ///

/* GET home page */
router.get('/', (req, res, next) => {
    return res.redirect('/posts')
})

router.get('/posts', (req, res) => {
    const posts = Post.find({}).then((post_count) => {res.json(post_count)})
})

router.get('/posts/:id', (req, res) => {
    const { id } = req.params
    const post = Post.find({_id: id}).then((found_post) => {res.json(found_post)})
})

router.get('/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = Post.find({_id: id}).populate('comments').then((found_comments) => {res.json(found_comments)})
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

/// POST ROUTES ///
// POST to create new blog post
router.post('/posts', (req, res) => {
    const date = new Date()
    postDetail = {
        title: req.body.title,
        body: req.body.body,
        timestamp: date,
        published: req.body.published
    }
    
    let post = new Post(postDetail)

    post.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
    })
    return res.redirect('/posts')
})

// POST to add comment to post
router.post('/posts/:id/comments', (req, res) => {
    res.send('Add comment to post')
})

/// UPDATE ROUTES ///

router.put('/posts/:id', (req, res) => {
    const { id } = req.params
    return res.json(req.body)
})

router.put('/posts/:id/comments/:commentId', (req, res) => {
    return res.send('Update comment')
})

/// DELETE ROUTES ///

router.delete('/posts/:id', (req, res) => {
    const { id } = req.params
    return res.json({ deleted: id })
})

router.delete('/posts/:id/comments/:commentId', (req, res) => {
    return res.send('Delete comment')
})

module.exports = router