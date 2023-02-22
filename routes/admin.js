var adminHelper = require('../helpers/admin-helpers')
var postHelper = require('../helpers/post-helpers');
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/login', { admin: true });
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
  await adminHelper.doAdminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminLogin = true
      req.session.adminSuccess = true
      req.session.admin = response.admin
      let adminloggedIn = req.session.admin
      res.render('admin/index', { admin: true, adminloggedIn })
    } else {
      res.redirect('/admin')
    }
  })
})

module.exports = router;
