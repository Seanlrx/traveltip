const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Attraction = require('../models/attraction');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//AuthorizeUser8.3 make sure the user is logged in and able to post the review form
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//AuthorizeUser8.11 apply the isReviewAuthor middleware and also apply the isLoggedIn middleware. 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;