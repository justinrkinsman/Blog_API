var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.pug', { title: 'Home Page' });
});

/* GET sign up page */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up.pug', {title: 'Sign Up'})
})

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login.pug', {title: "Log In"})
})

module.exports = router;
