const express = require('express');
const router = express.Router();
const attractions = require('../controllers/attractions');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateAttraction } = require('../middleware');
// Image1. multer is used to handle multipart/form-data and parse the uploading files and add a body and files object to the request body
const multer = require('multer');
// Image2. cloudinary is used to store the images uploaded from the clients (name, key, secret stored in env)
const { storage } = require('../cloudinary');
// Image3. assign cloudinary storage to multer
const upload = multer({ storage });

const Attraction = require('../models/attraction');

router.route('/')
    .get(catchAsync(attractions.index))
    // Image4. upload.array will allow uploading multipul files and store in the cloudinary storage
    // Login 8.1 apply isLoggedIn middleware for the pages requiring authentication. 
    .post(isLoggedIn, upload.array('image'), validateAttraction, catchAsync(attractions.createAttraction))


router.get('/new', isLoggedIn, attractions.renderNewForm)

router.route('/:id')
    .get(catchAsync(attractions.showAttraction))
    // Image7. upload the new images into the existing campground, then updateCampground will work on adding more images or deleting selected images
    // Login 8.1 apply isLoggedIn middleware for the pages requiring authentication. 
    // AuthorizeUser7.1 apply isAuthor to update edit page
    .put(isLoggedIn, isAuthor, upload.array('image'), validateAttraction, catchAsync(attractions.updateAttraction))
    // AuthorizeUser7.2 apply isAuthor to delete page
    .delete(isLoggedIn, isAuthor, catchAsync(attractions.deleteAttraction));

// Login 8.1 apply isLoggedIn middleware for the pages requiring authentication. 
// AuthorizeUser7.3 apply isAuthor to get the edit page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(attractions.renderEditForm))



module.exports = router;