module.exports = function(app, express){
	// requires
	var mongoose = require('mongoose');
	var fb = require('fb');

	// get the models
	var User = mongoose.model('User');
	var Echo = mongoose.model('Echo');

	// View our echos from friends
	app.get('/user/echoes', ensureAuthenticated, function(req, res){
	     // get the user
	     var user = req.user;

		// find our echoes from ourselves
		var q = Echo.find({ });
		q.populate('_creator', null, { id: user.id });
		q.populate('_parent');
		q.exec(function(err, docs){
			if (err) throw err;
			res.render('user', { title: 'Echo // Solve', active: 'solve', user: req.user, echoes: docs });
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