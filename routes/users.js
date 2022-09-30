// Login6. Create the User routes (Register, Login and Logout)
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

// Login6.2 Render the Register form under views/users/register and post the filled user data
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// Login7. Render the Login form under views/users/login and post the filled user data
// Login7.1 for the post, passport authenticate, local strategy, could put this into a seperate middleware. 
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// Login8. build-in logout method
router.get('/logout', users.logout)

module.exports = router;