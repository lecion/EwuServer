/**
 * Created by Lecion on 3/26/16.
 */
var Goods = require('../models/Goods');


exports.newAndSave = function (name, detail, pictures, seller, origin_price, sale_price, location, cb) {
    var goods          = new Goods.model();
    goods.name         = name;
    goods.detail       = detail;
    goods.pictures     = pictures;
    goods.seller       = seller;
    goods.origin_price = origin_price;
    goods.sale_price   = sale_price;
    goods.location     = location;

    goods.save(cb);
};