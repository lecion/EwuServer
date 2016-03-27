var config      = require('../../config.js');
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var Category = new Schema({
    name   : String,
    parent : {type : Schema.Types.ObjectId, ref : 'Category', default : null}
});

//var User = mongoose.model('User', UserSchema);
//var UserDao = new MongooseDao(User);

Category.plugin(require('./BaseModel'));
Category.index({parent : 1});

module.exports = new MongooseDao(mongoose.model('Category', Category));
