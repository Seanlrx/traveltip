const Attraction = require('../models/attraction');
// showPageMap1. apply mapbox-sdk package get use the service geocoding to get location coordinates (two functions and we will use one)
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
// Image8. require cloudinary to delete the selected images
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const attractions = await Attraction.find({}).populate('popupText');
    res.render('attractions/index', { attractions: attractions })
}

module.exports.renderNewForm = (req, res) => {
    res.render('attractions/new');
}

module.exports.createAttraction = async (req, res, next) => {
    // showPageMap2. apply forwardGeocode function to get coordinates by inputting location from the attraction. Limit only return one address
    const geoData = await geocoder.forwardGeocode({
        query: req.body.attraction.location,
        limit: 1
    }).send()
    const attraction = new Attraction(req.body.attraction);
    // showPageMap3. get the type: point data from the data and store it into the database (mapping this new session in the Model/attractions schema)
    attraction.geometry = geoData.body.features[0].geometry;
    // Image5 get the images information from req.files and map them into attraction.images, then save to Mongo database and redirect to show
    attraction.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // AuthorizeUser5. whenever we create the new attraction, assoctiate the user from request body to the author in the attraction model
    attraction.author = req.user._id;
    await attraction.save();
    console.log(attraction);
    req.flash('success', 'Successfully made a new attraction!');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.showAttraction = async (req, res,) => {
    // find one attraction based on the url id
    // AuthorizeUser3. populate author from attraction Model. 
    const attraction = await Attraction.findById(req.params.id).populate({
        // AuthorizeUser8.5 populate all the reviews from attraction Model and then populate the author of each review from review Model
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!attraction) {
        req.flash('error', 'Cannot find that attraction!');
        return res.redirect('/attractions');
    }
    // Image6 show the information in the view show page
    res.render('attractions/show', { attraction: attraction });
}

module.exports.renderEditForm = async (req, res) => {
    // get id from url
    const { id } = req.params;
    // based on the id and find attraction from database
    const attraction = await Attraction.findById(id)
    if (!attraction) {
        req.flash('error', 'Cannot find that attraction!');
        return res.redirect('/attractions');
    }
    res.render('attractions/edit', { attraction: attraction });
}

module.exports.updateAttraction = async (req, res) => {
    // get id from url
    const { id } = req.params;
    console.log(req.body);
    // find the corresponding attraction and update information according to the client edits and update in the database
    const attraction = await Attraction.findByIdAndUpdate(id, { ...req.body.attraction });
    // Image7 get the new images from req.files and push into the existing images array (...imgs is spray all components from the array into the new array)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    attraction.images.push(...imgs);
    await attraction.save();
    // Image8 check if there are deleteImages generated into req.body
    if (req.body.deleteImages) {
        // Image8.1 delete all selected images from cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // Image8.2 delete all selected images url from Mongo database
        await attraction.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated attraction!');
    res.redirect(`/attractions/${attraction._id}`)
}

module.exports.deleteAttraction = async (req, res) => {
    // get id from url
    const { id } = req.params;
    // delete the attraction in the database
    await Attraction.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted attraction')
    res.redirect('/attractions');
}