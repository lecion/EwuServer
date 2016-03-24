/**
 * Created by Lecion on 3/24/16.
 * 给所有 Model 的扩展功能
 * Reference: http://mongoosejs.com/docs/plugins.html
 */

module.exports = function(schema) {

    //var meta = {
    //    createAt: {type: Date, default: Date.now()},
    //    updateAt: {type: Date, default: Date.now()}
    //};

    schema.add({meta: {
        createAt: {type: Date, default: Date.now()},
        updateAt: {type: Date, default: Date.now()}
    }});
    schema.add({updateAt: {type: Date, default: Date.now()}});


    schema.pre('save', function(next) {
        if (this.isNew) {
            this.meta.createAt = this.meta.updateAt = Date.now();
        } else {
            this.meta.updateAt = Date.now();
        }
        next();
    });

    schema.pre('update', function(next) {
        this.update({}, {$set: {"meta.updateAt": Date.now()}});
        next();
    });


}
