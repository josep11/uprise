
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: {type: String, required: true},
    votes: {type: Number, required: false, default: 1},
    isSurvey:  {type: Boolean, default:false, select: false},
    data: {type: Date, default: Date.now(), select: false},
    message_responses: {type: Array, default: []}
});


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
