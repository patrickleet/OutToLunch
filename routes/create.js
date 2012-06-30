module.exports = function(app, express){
	// requires
	var mongoose = require('mongoose');

	// get our schemas
	var Echo = mongoose.model('Echo');

	// Create an echo form
	app.get('/create', ensureAuthenticated, function(req, res){ 
	    res.render('create', { title: 'Echo // Create', active: 'create', user: req.user });
	});

	// Create the echo and insert it into the database
	app.post('/create', ensureAuthenticated, function(req, res){
		// get our vars from the form
		var text = req.body.echoText;
		var iterations = req.body.iterationCount;
		
		// get our user
		var user = req.user;

		// create our new echo
		var echo = new Echo({ text: text, iterations: iterations, _creator: user._id });
		echo.save(function(err, data){
			if (err) throw err;
			res.redirect('/solve/' + data.id);
		});

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