var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Echo = new Schema({
    text: String,
    _creator: { type: Schema.ObjectId, ref: 'User' },
    _master: { type: Schema.ObjectId, ref: 'Echo' },
    _parent: { type: Schema.ObjectId, ref: 'Echo' },
    iterations: Number
}); 

mongoose.model('Echo', Echo);

