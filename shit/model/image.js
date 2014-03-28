

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var imageSchema = new Schema({
    kind: { type: String, enum: ['thumbnail', 'big'], required: true },
    url: {type: String, required: true, default: "http://fc07.deviantart.net/fs70/f/2012/085/e/6/my_facebook_profile_picture_by_spiritdsgn-d4u2u8z.jpg"}

});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;