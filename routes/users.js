var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')


const verifyLogin = (req, res) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {                        //get home page
  let user = req.session.user
  let userSuccess = req.session.userSuccess
  let items = [
    {
      lastDigit: 4444
    }
  ]
  let itemss = [
    {
      lastDigit: 4444
    }
  ]
  res.render('user/index', { items, itemss, user, userSuccess });
  // req.session.userSuccess = null
});


router.get('/signup', (req, res) => {                             //get user signup
  res.render('user/signup')
})

router.post('/signup', async (req, res) => {                      //store signup data
  // console.log(req.body);
  let alert = true
  let user = await userHelper.getUser(req.body)
  if (user.length > 0) {
    res.render('user/signup', { alert })
    alert = null
  } else {
    await userHelper.doSignup(req.body).then((response) => {
      req.session.userLogin = true
      req.session.userSuccess = true
      req.session.user = response.user
      // console.log(req.session.user);
      res.redirect('/')
    })
  }
})

router.get('/login', (req, res) => {                               //get user login
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login', { 'EmailErr': req.session.userLoginEmailErr, 'PasswordErr': req.session.userLoginPassErr });
    req.session.userLoginEmailErr = null
    req.session.userLoginPassErr = null
  }
})

router.post('/login', (req, res) => {                              //validate login and redirect to home
  userHelper.doLogin(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.userLogin = true
      req.session.userSuccess = true
      req.session.user = response.user
      res.redirect('/')
    } else if (response.emailStatus === true) {
      req.session.userLoginEmailErr = 'Invalid email address !!'
      res.redirect('/login')
    } else {
      req.session.userLoginPassErr = 'Incorrect Password !!'
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {                               //get user logout 
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
