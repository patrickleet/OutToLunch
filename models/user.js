var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
	id: String,
	username: String,
	displayName: String
}); 

mongoose.model('User', User);

