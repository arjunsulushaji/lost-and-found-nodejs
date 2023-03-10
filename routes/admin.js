
var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')
var postHelper = require('../helpers/post-helpers');
var adminHelper = require('../helpers/admin-helpers')
const { response } = require('express');


/* GET users listing. */
router.get('/', async function(req, res, next) {
    res.render('admin/login', { admin: true});
});

router.get('/signup', (req, res) => {
  res.render('admin/signup', { admin: true })
})

router.post('/signup', async (req, res) => {
  // console.log(req.body);
  await adminHelper.doAdminSignup(req.body).then((response) => {
    req.session.adminLogin = true
    req.session.admin = response.admin
    // console.log(req.session.user);
    res.redirect('/admin')
  })
})

router.post('/login', async (req, res) => {
  // console.log(req.body);
  let user = await adminHelper.getUserAll()
  let post = await adminHelper.getPostAll()
  await adminHelper.doAdminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminLogin = true
      req.session.adminSuccess = true
      req.session.admin = response.admin
      let adminloggedIn = req.session.admin
      res.render('admin/index', { admin: true, adminloggedIn,user,post })
    } else if (response.emailStatus === true) {
      req.session.adminLoginEmailErr = 'Invalid email address !!'
      res.render('admin/login',{'EmailErr': req.session.adminLoginEmailErr})
      req.session.adminLoginEmailErr = null
    } else {
      req.session.adminLoginPassErr = 'Incorrect Password !!'
      res.render('admin/login',{'PasswordErr': req.session.adminLoginPassErr })
      req.session.adminLoginPassErr = null
    }
  })
})

router.get('/logout', (req, res) => {                               //get user logout 
  req.session.destroy()
  res.redirect('/admin')
})

module.exports = router;
