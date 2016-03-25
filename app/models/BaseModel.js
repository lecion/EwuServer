/**
 * Created by Lecion on 3/24/16.
 * 给所有 Model 的扩展功能
 * Reference: http://mongoosejs.com/docs/plugins.html
 */

module.exports = function(schema) {

    schema.add({
        create_at: {type: Date, default: Date.now()},
        update_at: {type: Date, default: Date.now()}
    });

    schema.pre('save', function(next) {
        if (this.isNew) {
            this.create_at = this.update_at = Date.now();
        } else {
            this.update_at = Date.now();
        }
        next();
    });

    schema.pre('update', function(next) {
        this.update({}, {$set: {update_at: Date.now()}});
        next();
    });

}
