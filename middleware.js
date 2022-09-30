const { attractionSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Attraction = require('./models/attraction');
const Review = require('./models/review');

// Login 8. build the login middleware applying the passport build-in authenticated method. 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Login10. if the user is not logged, store the url the client wants to go through in the session
        // Login10.1 After loggin in, it will directly redirect to this url.
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateAttraction = (req, res, next) => {
    const { error } = attractionSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//AuthorizeUser7. build a middleware to be applied in get edit page, put/update an edit to a page and delete checking whether you are the owner. 
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const attraction = await Attraction.findById(id);
    if (!attraction.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/attractions/${id}`);
    }
    next();
}

//AuthorizeUser8.8 get the reviewId from params of url and also the attraction id from url for redirecting to the same attraction
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    //AuthorizeUser8.9 check if the review author is current logging in author to perform the delete action. 
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        // AuthorizeUser8.10 have to return this action or it will perform the next method. 
        return res.redirect(`/attractions/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}