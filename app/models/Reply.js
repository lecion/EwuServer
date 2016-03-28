/**
 * Created by Lecion on 3/28/16.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var MongooseDao = require('mongoosedao');
var ObjectId    = Schema.Types.ObjectId;
var ReplySchema = new Schema({
    content  : String,
    goods_id : {type : ObjectId, ref : 'Goods'},
    reply_id : {type : ObjectId, ref : 'Reply', default : null},
    from     : {type : ObjectId, ref : 'User'},
    to       : {type : ObjectId, ref : 'User', default : null},
    deleted  : {type : Boolean, default : false},
});

ReplySchema.plugin(require('./BaseModel'));
ReplySchema.index({goods_id : 1});
ReplySchema.index({from : 1, create_at : -1});

var ReplyModel = mongoose.model('Reply', ReplySchema);

module.exports = new MongooseDao(ReplyModel);