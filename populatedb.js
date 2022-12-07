#! /usr/bin/env mode

// Get arguments passed on command line
var userArgs = process.argv.slice(2);  
require('dotenv').config()
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
const User = require('./models/user')
const Post = require('./models/post')
const Comment = require('./models/comment')


var mongoose = require('mongoose');
const { Timestamp } = require('mongodb');
var mongoDB = process.env.MONGO_URL;   ///Add mongourl///
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var posts = []
var comments = []

function userCreate(username, password, admin, cb) {
    userDetail = {
        username: username,
        password: password,
    }
    if (admin !== false) userDetail.admin = admin
  
    var user = new User(userDetail);
       
    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
    }  );
}

function commentCreate(body, timestamp, user, cb) {
    commentDetail = {
        body: body,
        timestamp: timestamp,
        user: user,
    }
  
    var comment = new Comment(commentDetail);
       
    comment.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
    console.log('New Comment: ' + comment);
    comments.push(comment)
    cb(null, comment)
    }  );
}

function postCreate(title, body, timestamp, comments, published, cb) {
    postDetail = {
        title: title,
        body: body,
        timestamp: timestamp,
        comments: comments
    }
    if (published !== false) postDetail.published = published

    var post = new Post(postDetail)
       
    post.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post);
  }   );
}

function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate('supercooljustindude@gmail.com', 'password', false, callback);
        },
        function(callback) {
            userCreate('justinrkinsman@gmail.com', 'password', true, callback)
        },
        ],
        // optional callback
        cb);
}

function createComments(cb) {
    async.parallel([
        function(callback) {
            let date = new Date()
            commentCreate('I disagree!', date, users[0], callback)
        },
    ],
    // optional callback
    cb)
}

function createPosts(cb) {
    async.parallel([
        function(callback) {
            let date = new Date()
            postCreate("Winners Don't Do Drugs", "I pity the fool who does drugs", date, comments[0], true, callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createUsers,
    createComments,
    createPosts,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Posts: '+posts);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});