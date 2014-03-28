/**
 * Created by JOSEP on 18/03/14.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Image = require('./image');

var UserSchema = new Schema({
    name: { type: String, required: true },
    surnames: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    image: {type: Schema.Types.ObjectId, ref: 'Image' , required: false},
    active: {type: Boolean, required: false, default: false, select: false},
    isAmo: {type: Boolean, required:false, default: false, select: false},
    password: {type: String, required: false, select: false}
});

UserSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    console.log("eliminem imatge");
    Image.remove({_id: this.image}).exec();
    next();
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
