

var User = require('../model/user');

exports.get = function(req, res){

    User.find({}, function (err, users) {
        if (!err) {
            res.send(users);
        } else {
            return console.log(err);
        }
    });
};

