module.exports = function(app, express){
	// requires
	var mongoose = require('mongoose');
	var fb = require('fb');

	// get the models

	// View our echos from friends
	app.get('/user/echoes', ensureAuthenticated, function(req, res){
	  // get the user
	  var user = req.user;
		res.render('user', { title: 'Out To Lunch', user: req.user });
	});

	// Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed.  Otherwise, the user will be redirected to the
	//   login page.
	function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        req.flash('error', 'You must be logged in to use this feature.');
       	res.redirect('/');
    }
}