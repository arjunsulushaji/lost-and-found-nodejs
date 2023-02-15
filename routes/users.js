var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')
var postHelper = require('../helpers/post-helpers')


const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {                        //get home page
  let user = req.session.user
  let userSuccess = req.session.userSuccess
  await postHelper.getLostThings().then(async(lostThings) => {
    await postHelper.getFoundThings().then((foundThings) => {
      res.render('user/index', { lostThings,foundThings, user, userSuccess });
    })
  })
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
    // console.log(response);
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

router.get('/add-lost-things', verifyLogin, (req, res) => {              //get lost thing post upload page
  res.render('user/add-lost-things')
})

router.post('/add-lost-things', verifyLogin, (req, res) => {             //add post of lost things
  // console.log(req.body);
  postHelper.addLostThings(req.body, req.session.user).then(() => {
    res.redirect('/')
  })
})

router.get('/add-found-things', verifyLogin, (req, res) => {
  res.render('user/add-found-things')
})

router.post('/add-found-things', verifyLogin, (req, res) => {
  postHelper.addFoundThings(req.body, req.session.user).then(() => {
    res.redirect('/')
  })
})

module.exports = router;
