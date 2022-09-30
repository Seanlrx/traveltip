// Login1. create the user model with plug in of passport local strategy. 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Login2. This will add on to our schema and provide us some fuctions for our username and password to use
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);