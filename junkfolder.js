/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.pug', { title: 'Home Page' });
  });
  
  /// SIGN UP PAGE ROUTES
  
  /* GET sign up page */
  router.get('/sign-up', function(req, res, next) {
    res.render('sign-up.pug', {title: 'Sign Up'})
  })
  
  /* POST sign up page to create new user */
  router.post('/sign-up', [
    // Validate and sanitize fields
    body('username')
      .trim()
      .isLength({ min: 1, max: 100 })
      .toLowerCase()
      .escape()
      .withMessage('Username required'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 100 })
      .escape()
      .withMessage("Password is required"),
    check('confirm_password')
      .exists()
      .custom((value, {req}) => value === req.body.password)
      .withMessage('Passwords must match'),
    // Process request after validation and sanitization
    (req, res, next) => {
      const errors = validationResult(req)
  
      // Create a User object with escaped and trimmed data
      const user = new User({
        username: req.body.username.toLowerCase(),
        password: req.body.password,
      })
  
      if (!errors.isEmpty()) {
        res.render('sign-up.pug', {
          title: "Sign Up",
          user: req.user,
          errors: errors.array(),
        })
        return
      } else {
        // Data from form is valid. Check if user with same username exists.
        User.findOne({ username: req.body.username.toLowerCase() }).exec((err, found_username) => {
          if (err) {
            return next(err)
          }
          if (found_username) {
            res.render('sign-up.pug', {info: "Username already in use"})
          } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
              const user = new User({
                username: req.body.username.toLowerCase(),
                password: hashedPassword
              }).save(err => {
                if (err) {
                  return next(err)
                }
                res.redirect('/')
              })
            })
          }
        })
      }
    }
  ])
  
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