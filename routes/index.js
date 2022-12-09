var express = require('express');
var router = express.Router();

/// GET Routes ///

/* GET home page */
router.get('/', (req, res) => {
    return res.render("index.pug", { title: "Home Page" })
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

router.post('/', (req, res) => {
    return res.send("Received a POST HTTP method")
})

router.put('/', (req, res) => {
    return res.send("Received a PUT HTTP method")
})

router.delete('/', (req, res) => {
    return res.send("Received a DELETE HTTP method")
})

module.exports = router