/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.pug', { title: 'Home Page' });
  });
  
  /// SIGN UP PAGE ROUTES
  
  /* GET sign up page */
  router.get('/sign-up', function(req, res, next) {
    res.render('sign-up.pug', {title: 'Sign Up'})
  })
  
  /// LOGIN ROUTES ///
  
  /* GET login page */
  router.get('/login', function(req, res, next) {
    res.render('login.pug', {title: "Log In"})
  })
  
  /* Failed login */
  router.get('/failed-login', function(req, res, next) {
    res.render('failed-login.pug', {title: "Log-in Attempt Failed"})
  })
  
  router.get('/success-login', (req, res, next) => {
    res.render('success-login.pug', {title: 'ur winner'})
  })