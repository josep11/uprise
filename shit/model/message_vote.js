
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageVoteSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User' , required: true},
    message: {type: Schema.Types.ObjectId, ref: 'Message' , required: true} //abans estava required false TODO potser falla
});


var Message_Vote = mongoose.model('Message_Vote', messageVoteSchema);

module.exports = Message_Vote;
