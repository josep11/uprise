

var Image = require('../model/image');

exports.get = function(req, res){

   Image.find()
       //.where('isAmo',false)
       //User.find({isAmo:false}) //TODO DESCOMENTAR, NOMES SERVEIX PER DEBUGAR
        .select(' -__v')// -isAmo') //TODO DESCOMENTAR, NOMES SERVEIX PER DEBUGAR
        .exec (function (err, models) {
        if (!err) {
            res.send(models);
        } else {
            return res.json({ok: false, err: err});
        }
    });
};


exports.getOne = function(req, res) {
    Image.findOne({ _id: req.params.id })
        .select('-__v -active')
        .exec( function(err, user) {
            res.send(user);
    });
};
