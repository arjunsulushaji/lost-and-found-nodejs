var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/user-helpers')
var postHelper = require('../helpers/post-helpers');
const { response } = require('express');
const notifier = require('node-notifier');


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
  let size = 0
  if (user) {
    let item = await postHelper.getUserItem(user)
    size = item.length
  }
  await postHelper.getFoundThings().then((foundThings) => {
    res.render('user/index', { foundThings, user, size });
  })
  // req.session.userSuccess = null
});


router.get('/signup', (req, res) => {                             //get user signup
  res.render('user/signup')
})

router.post('/signup', async (req, res) => {                      //store signup data
  console.log(req.body);
  let alert = true
  let user = await userHelper.getUser(req.body)
  if (user.length > 0) {
    res.render('user/signup', { alert })
    alert = null
  } else {
    await userHelper.doSignup(req.body).then((response) => {
      req.session.userLogin = true
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


router.get('/add-found-things', verifyLogin, async (req, res) => {              //get form for found things
  let user = req.session.user
  let size = null
  if (user) {
    let item = await postHelper.getUserItem(user)
    size = item.length
  }
  res.render('user/add-found-things', { user, size })
})

router.post('/add-found-things', verifyLogin, (req, res) => {            //add post for found things
  postHelper.addFoundThings(req.body, req.session.user).then(() => {
    res.redirect('/')
  })
})

router.get('/details', async (req, res) => {                               //get details of lost items
  // console.log(req.query.id);
  let details = await postHelper.getPostDetails(req.query.id)
  // console.log(details);
  res.render('user/show-details', { details })
})

router.get('/found-things-post', verifyLogin, async (req, res) => {         //get found things post uploaded user
  let foundThings = await postHelper.getFoundThing(req.session.user)
  let user = req.session.user
  // console.log(lostThings);
  let size = null
  if (user) {
    let item = await postHelper.getUserItem(user)
    size = item.length
  }
  if (foundThings.length > 0) {
    res.render('user/show-posts2', { foundThings, user, size })
  } else {
    res.redirect('/')
  }
})

router.post('/delete-found-post:id', async (req, res) => {                         //delete found thing post 
  // console.log(req.params.id);
  await postHelper.deleteFoundPost(req.params.id).then((response) => {
    res.json(response)
  })
})

router.get('/edit-found-post', async (req, res) => {                                 //get value to edit found post
  let post = await postHelper.getFoundPost(req.query.id)
  let user = req.session.user
  // console.log(post);
  res.render('user/edit-found-things', { post, user })
})

router.post('/edit-found-post', (req, res) => {                                     //edit found post
  // console.log(req.body);
  postHelper.editFoundPost(req.body).then(() => {
    res.redirect('/found-things-post')
  })
})

router.get('/notification', verifyLogin, async (req, res) => {                        //get notification
  let user = req.session.user
  let item = await postHelper.getUserItem(req.session.user)
  // console.log(item);
  if (item.length > 0) {
    res.render('user/notification', { item, user })
  } else {
    res.redirect('/')
  }
})

router.get('/edit-profile', async (req, res) => {                                            //edit profile of user
  let user = req.session.user
  let size = null
  if (user) {
    let item = await postHelper.getUserItem(user)
    size = item.length
  }
  let userData = await userHelper.getUserData(user)
  // console.log(userData);
  res.render('user/edit-profile', { user, userData, size })
})

router.post('/edit-profile', verifyLogin, (req, res) => {                                       //submit edited profile
  // console.log(req.body);
  userHelper.editUserProfile(req.body).then(() => {
    res.json({ success: true })
  })
})

router.post('/search', async (req, res) => {
  // console.log(req.body);
  let user = req.session.user
  let search = await userHelper.getSearch(req.body)
  // console.log(search);
  let length = search.length;
  if (length > 0) {
    res.render('user/search', { search, user })
  } else {
    res.redirect('/')
    notifier.notify({
      title: 'ALERT',
      message: 'Sorry no item found !',
    });
  }
})

module.exports = router;
