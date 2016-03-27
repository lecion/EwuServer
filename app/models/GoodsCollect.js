/**
 * Created by Lecion on 3/27/16.
 */
var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var MongooseDao   = require('mongoosedao');
var ObjectId      = Schema.Types.ObjectId;
var CollectSchema = new Schema({
    user_id  : {type : ObjectId, ref : 'User'},
    goods_id : {type : ObjectId, ref : 'Goods'}
});

CollectSchema.plugin(require('./BaseModel'));
CollectSchema.index({user_id : 1});

var CollectModel = mongoose.model('GoodsCollect', CollectSchema);

module.exports = new MongooseDao(CollectModel);