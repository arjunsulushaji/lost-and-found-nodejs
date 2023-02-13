var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  let items = [
    {
      lastDigit: 4444
    },
    {
      lastDigit: 4455
    },
    {
      lastDigit: 5555
    },
    {
      lastDigit: 7788
    },
    {
      lastDigit: 1122
    },
    {
      lastDigit: 1245
    }
  ]
  let itemss = [
    {
      lastDigit: 4444
    },
    {
      lastDigit: 4455
    },
    {
      lastDigit: 5555
    },
    {
      lastDigit: 7788
    },
    {
      lastDigit: 1122
    },
    {
      lastDigit: 1245
    }
  ]
  res.render('user/index', { items,itemss });
});

//signup router setup
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',async(req,res)=>{
  // console.log(req.body);
  await userHelper.doSignup(req.body).then((response)=>{
    res.redirect('/')
  })
})

module.exports = router;
