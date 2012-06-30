module.exports = function(app, express){
	// requires
	var mongoose = require('mongoose');
	var fb = require('fb');

	// get the models
	var User = mongoose.model('User');
	var Echo = mongoose.model('Echo');

	// View our echos from friends
	app.get('/solve', ensureAuthenticated, function(req, res){
	    // get the user
	    var user = req.user;

		// find our echoes
		// todo: find only echoes not from user.id 
		// look at http://mongoosejs.com/docs/query.html and Query.ne
		var q = Echo.find({ });
		q.populate('_creator');
		q.populate('_parent');
		q.exec(function(err, docs){
			if (err) throw err;
			res.render('solve', { title: 'Echo // Solve', active: 'solve', user: req.user, echoes: docs });
		});
	});

	// View a specific echo
	app.get('/solve/:id', ensureAuthenticated, function(req, res){
	    // get the user
	    var user = req.user;

	    // get the id of the echo to solve
	    var echoId = req.params.id;

	    // assemble a query to check if the echo exists
	    var q = Echo.find({ });
	    q.where('_id', echoId);
		q.populate('_creator');
	    q.exec(function(err, docs){
	    	if (err || docs == null) {
	    		req.flash('error', 'Invalid Echo, please select a valid Echo from the list below.');
	    		return res.redirect('/solve');
	    	}

	    	// extract our first item as our echo
	    	var echo = docs[0];

	    	// assmble a query to find all related docs
	    	var q = Echo.find({ });
	    	q.populate('_master');
			q.where('_master._id == this._id');
			q.count(function(err, count){
				if (count % 2) {
					res.render('solve/play-word', { title: 'Echo // Solve', active: 'solve', user: req.user, echo: echo });
				} else {
					res.render('solve/play-image', { title: 'Echo // Solve', active: 'solve', user: req.user, echo: echo });
				}
			})
	    })

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