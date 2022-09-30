// if we are in the developping phrase then we need to use env files to store our keys and passwords
// if we are in the production phrase then we will use Heroku to store keys and passwords
// dotenv package needs to installed to load environment variables from .env file into process.env
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users');
const attractionRoutes = require('./routes/attractions');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require("connect-mongo");

// mongoose connecting with our MongoDB database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // mongoose DeprecationWarning go aways
    useFindAndModify: false
});
//catch error if there is any error during the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// -----------------------------------------------

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// PublicStatic1. make sure the files under public folder are running 
app.use(express.static(path.join(__dirname, 'public')))

// Setting up the Session for Data store passwor and user informaiton temporaly without storing in the database. 
const secret = 'thisshouldbeabettersecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
// Flash message will be stored in the Session Data Store. 
app.use(flash());
// ----------------------------------------------------


// Login3. Configure our app to apply passport with session and apply local strategy
app.use(passport.initialize());
app.use(passport.session());
// Login4. Apply the local strategy.(Could also add other strategies like facebook, twiter...)
passport.use(new LocalStrategy(User.authenticate()));
// Login5. store and unstore our username and password in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 
app.use((req, res, next) => { 
    console.log(req.session)
    // Login9. passport put the user under request. To make sure in all of my templates, I will have access to currentUser. 
    // Login9.1 under views/partials/navbar, it will check currentUser to show register, login and logout. 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Login6.1 app uses the userRoutes.
app.use('/', userRoutes);
app.use('/attractions', attractionRoutes)
app.use('/attractions/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});

// under our server, if any url can't be recoganized, then it will trigger ExpreeError under Utils folder. 
// And then trigger the next error function right below.
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// any express error triggered it will go to this function and showing the message. 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serving on port 3000')
})


