var express = require('express');
var router = express.Router();

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

module.exports = router;
