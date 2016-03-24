/**
 * Created by Lecion on 12/18/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongooseDao = require('mongoosedao');
var goodsSchema = new Schema({
    name: String,
    origin_price: Number,
    sale_price: Number,
    quality: String,
    intro: String
});

var BaseModel = require('./BaseModel');
goodsSchema.plugin(BaseModel);

var GoodsModel = mongoose.model('goods', goodsSchema);
module.exports = new MongooseDao(GoodsModel);