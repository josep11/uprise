
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userVoteSchema = new Schema({
    user_votador: {type: Schema.Types.ObjectId, ref: 'User' , required: true},
    user_votat: {type: Schema.Types.ObjectId, ref: 'User' , required: true}
});


var User_Vote = mongoose.model('User_Vote', userVoteSchema);

module.exports = User_Vote;
