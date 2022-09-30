const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    body: String,
    rating: Number,
    //AuthorizeUser8.1 add a new field for review model
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);

