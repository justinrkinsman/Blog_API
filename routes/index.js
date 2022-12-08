var express = require('express');
var router = express.Router();
const async = require('async')
const { body, validationResult, check } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')

router.get('/api', (req, res) => {
  res.json({
    message: "Welcome to the Home Page"
  })
})

module.exports = router;
