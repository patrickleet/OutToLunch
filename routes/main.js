module.exports = function(app, express){
    // requires
    var passport = require('passport');

    // index route
    app.get('/', function(req, res){
        res.render('index', { title: 'Echo // Home', active: 'home', user: req.user });
    });    

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    // /auth/facebook/callback
    app.get('/auth/facebook/login', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
    );

    // Logout the user and redirect them
    app.get('/auth/facebook/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    // Handle a logged out user
    app.get('/login', function(req, res){
        res.render('login', { title: 'Echo // Login' });
    });
}