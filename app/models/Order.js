/**
 * Created by Lecion on 3/27/16.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');
var ObjectId    = Schema.Types.ObjectId;
var OrderSchema = new Schema({
    user_id  : {type : ObjectId, ref : 'User'},
    goods_id : {type : ObjectId, ref : 'Goods'}
});

OrderSchema.plugin(require('./BaseModel'));
OrderSchema.index({user_id : 1});

var OrderModel = mongoose.model('GoodsCollect', OrderSchema);

module.exports = new MongooseDao(OrderModel);