const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        // Login6.3. build-in register method to take password, hash it. Store the salt and the hash result on our new user. 
        const registeredUser = await User.register(user, password);
        // Login6.6 after the user registered successfully, then go directly to trigger the user login by applying login method here. 
        req.login(registeredUser, err => {
            if (err) return next(err);
            // Login6.4 if no error login to the attractions main page. 
            req.flash('success', 'Welcome to Travel Trips!');
            res.redirect('/attractions');
        })
    } catch (e) {
        // Login6.5 if any error, flash the error and go back to register page again. 
        req.flash('error', e.message);
        res.redirect('register');
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

// Login7.2 post login and also make sure the url is stored in session and go back to the previous client url
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    // Login10.2 get the returnTo url from session which is added in the middleware isLoggedIn. 
    // Login10.3 there are possibilies that user go directly to the login page with out returnTo url added to the session. 
    const redirectUrl = req.session.returnTo || '/attractions';
    // Login10.4 after assigned the returnTo url, delete it directly, no need to store in the session. 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Login9.1 buildin-logout method and go back to attractions main page. 
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/attractions');
}