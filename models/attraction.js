const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_200/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//Image9 everytime you call thumbnail, the image will have new property of thumbnail, the image showing in the edit deleting page will be set the width of 200
//Image9 so we don't need to store this new url into database
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// clusterMap7.2 mongoose doesn't include virtuals when you convert a document to JSON by default. To include, you should set it to true and pass it to CamgroundSchema
const opts = { toJSON: { virtuals: true } };

const AttractionSchema = new Schema({
    title: String,
    images: [ImageSchema],
    // Map3.1 Mongo support a lot of geoJSON formats, so we will make sure the format is the same: the type has to be Point. 
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    // AuthorizeUser1. add the author attribute in the attraction 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


// clusterMap7.1 apply the virtual property to set the properies.popUp under public/javascripts/clusterMap. Also you have to set the above opts to true!
// actually the virtual data is not stored in the database. it is typically used for computed properties on document. 
AttractionSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/attractions/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});



AttractionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Attraction', AttractionSchema);