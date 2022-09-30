// Image2.1 cloudinary and multer-storage-cloudinary are required
// Image2.2 multer parse images to store in cloudinary and also get the url
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Image2.3 configure the cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Image2.4 create a new folder in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'TravelTrips',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}