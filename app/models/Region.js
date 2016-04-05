var config      = require('../../config.js');
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var Region = new Schema({
    id   : Number,
    pid  : Number,
    type : Number,
    code : Number,
    name : String,
});

Region.plugin(require('./BaseModel'));
Region.index({id : 1});
Region.index({pid : 0});
Region.index({code : 1});

module.exports = new MongooseDao(mongoose.model('Region', Region));
