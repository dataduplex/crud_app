/**
 * Created by jeluma200 on 7/9/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema;
userSchema = new Schema({
    _id: String
    , group: { type: String, required: true }
    , active: { type: String, required: true }
    , email: { type: String, required: true }
    , createDate: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Users', userSchema);

/**
 *
 var Movie = mongoose.model('Movie', movieSchema);
 mongoose.connect('mongodb://localhost/test');


 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function() {
    // we're connected!
    console.log('Connected to DB');
});

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('meow');
    }
});
 */