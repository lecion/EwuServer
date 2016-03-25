var config = require('../../config.js');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var MongooseDao = require('mongoosedao');

var UserSchema = new Schema({
    name: {
        unique: true,
        type: String,
    },
    phone: String,
    password: String,
    gender: Number,
    avatar: String,
    location: String,
})

UserSchema.pre('save', function (next) {
    var user = this

    if (!this.avatar) {
        this.avatar = '';
    }

    if (!this.phone) {
        this.phone = '';
    }

    bcrypt.genSalt(config.SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            user.password = hash;
            next();
        })
    })
});

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('update_at')
            .exec(cb)
    },
    findByName: function (name, cb) {
        return this.findOne({name: name}, cb);
    }
}


UserSchema.path('name').validate(function (v) {
    return v && v.length > 3;
}, 'err');

UserSchema.path('password').validate(function (v) {
    return v && v.length > 5;
})

//var User = mongoose.model('User', UserSchema);
//var UserDao = new MongooseDao(User);

UserSchema.plugin(require('./BaseModel'));
UserSchema.index({create_at: -1});

module.exports = new MongooseDao(mongoose.model('User', UserSchema));
