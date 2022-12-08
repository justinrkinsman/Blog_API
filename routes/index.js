var express = require('express');
var router = express.Router();
const async = require('async')
const { body, validationResult, check } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')

/* Home Page */
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models))
})

module.exports = router;
