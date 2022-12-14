var express = require('express');
var router = express.Router();
const async = require('async')
const { DateTime } = require('luxon')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Comment = require('../models/comment')
const Post = require('../models/post');
const user = require('../models/user');

/// GET APIs ///
// GET list of posts
router.get('/api/posts', (req, res) => {
    Post.find({}).sort({db_timestamp: -1}).then((post_count) => {res.json(post_count)})
})

// GET specific post
router.get('/api/posts/:id', async (req, res) => {
    const { id } = req.params
    const data = {}
    await Post.find({_id: id}).then((found_post) => {data[0] = found_post})
    await Comment.find({post: id}).then((found_comments) => {data[1] = found_comments})
    res.json(data)
})

// GET specific comment
router.get('/api/posts/:id/comments/:commentId', (req, res) => {
    Comment.find({_id: req.params.commentId}).populate('user').then((found_comments) => {res.json(found_comments)})
})

// GET comments list for specfic post
router.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    Comment.find({post: id})
    .sort({db_timestamp: -1})
    .populate('user')
    .then((found_comments) => {res.json(found_comments)})
})

// GET post edit page
router.get('/api/posts/:id/edit-post', (req, res) => {
    const { id } = req.params;
    Post.find({_id: id}).then((found_post) => res.json(found_post))
})

// GET post delete page
router.get('/api/posts/:id/delete-post', (req, res) => {
    const { id } = req.params
    Post.find({_id: id}).then((found_post) => res.json(found_post))
})

/// POST APIs ///
//POST login
/*router.post('/api/login', (req, res) => {
    
})*/

// POST to create new blog post
router.post('/api/posts', (req, res) => {
    const date = new Date()
    newTimestamp = DateTime.fromJSDate(date).toFormat("MMMM d yyyy h:mm a")
    postDetail = {
        title: req.body.title,
        body: req.body.body,
        timestamp: newTimestamp,
        db_timestamp: date,
        published: req.body.published
    }
    
    let post = new Post(postDetail)

    post.save(function (err) {
        return
    })
    res.redirect('/api/posts')
})

// POST to add comment to post
router.post('/api/posts/:id/comments', async (req, res) => {
    const { id } = req.params
    const date = new Date()
    newTimestamp = DateTime.fromJSDate(date).toFormat("MMMM d yyyy h:mm a")    
    
    const userId = await User.findOne({username: req.body.user})

    commentDetail = {
        body: req.body.body,
        timestamp: newTimestamp,
        db_timestamp: date,
        user: userId,
        post: id
    }

    let comment = new Comment(commentDetail)

    comment.save(function (err) {
        if (err) {
            console.log(err)
            return
        }
    })

    Post.findByIdAndUpdate(id, {_id: id, $push: {comments: comment}},
        function(err, docs) {
            if (err) {
                console.log(err)
            }else{
                console.log('Update Post :', docs)
            }
        })

    res.redirect(`/api/posts/${id}/comments`)
})

/// UPDATE APIs ///
// PUT update post
router.put('/api/posts/:id', (req, res) => {
    const { id } = req.params

    Post.findByIdAndUpdate(req.params.id, {_id: req.params.id, title: req.body.title, body: req.body.body},
        async function(err, docs) {
            if (err) {
                console.log(err)
            }else{
                console.log('Update Post :', docs)
            }
        })

    res.redirect(`/api/posts/${id}`)
})

// PUT update comment
router.put('/api/posts/:id/comments/:commentId', (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentId

    Comment.findByIdAndUpdate(commentId, {_id: commentId, body: req.body.body},
        function(err, docs) {
            if (err) {
                console.log(err)
            }else{
                console.log('Update Post :', docs)
            }
        })

    return res.send(`Comment number ${commentId} updated`)
})

/// DELETE APIs ///
/// DELETE post
router.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params

    Comment.deleteMany({ post: id }, function(err, result) {
        if (err) {
            console.log(err)
        }else{
            console.log("Deleted comments: ", result)
        }
    })

    Post.findByIdAndDelete(id, (err, docs) => {
        if (err) {
            console.log(err)
        }else{
            console.log('Deleted: ', docs)
        }
    })

    return res.json({ deleted: id })
})

/// DELETE comment
router.delete('/api/posts/:id/comments/:commentId', (req, res) => {
    const commentId = req.params.commentId
    const id = req.params.id

    Comment.findByIdAndDelete(commentId, (err, docs) => {
        if (err) {
            console.log(err)
        }else{
            console.log('Deleted: ', docs)
        }
    })

    Post.findByIdAndUpdate(req.params.id, {_id: req.params.id, $pull: {comments: commentId}},
        function(err, docs) {
            if (err) {
                console.log(err)
            }else{
                console.log('Update Post :', docs)
            }
        })
    
    return res.send(`Deleted comment ${commentId}`)
})

module.exports = router