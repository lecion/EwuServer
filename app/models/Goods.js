/**
 * Created by Lecion on 12/18/15.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');
var ObjectId    = Schema.Types.ObjectId;
var goodsSchema = new Schema({
    name          : String,
    detail        : String,
    pictures      : [String],
    seller        : {type : ObjectId, ref : 'User'},
    origin_price  : Number,
    sale_price    : Number,
    category      : {type : ObjectId, ref : 'Category'},
    collect_count : {type : Number, default : 0},
    location      : {
        province : String,
        city     : String,
    },
    status        : {type : Number, enum : [-1, 0, 1], default : 0}, //0 => 正常, -1 => 删除, 1 => 拍下
    reply_count   : {type : Number, default : 0}
});

goodsSchema.plugin(require('./BaseModel'));
goodsSchema.index({update_at : -1});
goodsSchema.index({collect_count : -1});
goodsSchema.index({sale_price : 1, update_at : -1});

var GoodsModel = mongoose.model('Goods', goodsSchema);

module.exports = new MongooseDao(GoodsModel);