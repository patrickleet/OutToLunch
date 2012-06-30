/**
 * Configuration for the app
 **/
module.exports = function(app, express){
	// store this in context as config
	var config = this;

	// requires 
	var passport = require('passport'),
		FacebookStrategy = require('passport-facebook').Strategy,
		mongoose = require('mongoose');

	// models
	var User = mongoose.model('User');

	// configure passport for facebook login
	passport.use(
		new FacebookStrategy({
		    clientID: '363716750365612',
		    clientSecret: '2ea4cb6ea0c0692949c6955d779bc609',
		    callbackURL: "/auth/facebook/callback"
		},
  		function(accessToken, refreshToken, profile, done) {
			User.findOne({id: profile.id}, function(err, user) {
				if(user) {
					done(null, user);
				} else {
					profile.token = accessToken;
					var user = new User(profile);
					user.save(function(err) {
						if (err) throw err;
						done(null, user);
					});
				}
			});
		})
	);

	passport.serializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.deserializeUser(function(obj, done) {
		var User = mongoose.model('User');
		User.findOne({id: obj.id}, function (err, user) {
			if (err) throw err;
			done(err, obj);
		});
	});

	// configure the app
	app.configure(function(){
    	app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.set('view options', { layout: true });
		app.use(require('less-middleware')({ src: __dirname + '/public', compress: true }));
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger()); 
		app.use(express.cookieParser()); 
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(express.session({ secret: 'tyler durden' }));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(app.router);
		app.dynamicHelpers({ messages: require('express-messages-bootstrap') });
	});

    mongoose.connect('mongodb://localhost/echo');

	app.configure('development', function(){
	    app.use(express.static(__dirname + '/public'));
	    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

	app.configure('production', function(){
		var oneYear = 31557600000;
		app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
		app.use(express.errorHandler());
	});

}