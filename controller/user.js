

var User = require('../model/user'),
    Image = require('../model/image');

exports.get = function(req, res){

   User.find()
       //.where('isAmo',false)
       //User.find({isAmo:false}) //TODO DESCOMENTAR, NOMES SERVEIX PER DEBUGAR
        .select(' -__v')// -isAmo') //TODO DESCOMENTAR, NOMES SERVEIX PER DEBUGAR
        .populate('image')
        .exec (function (err, users) {
        if (!err) {
            res.send(users);
        } else {
            return res.json({ok: false, err: err});
        }
    });
};


exports.create = function(req, res) {

    User.findOne({ email: req.body.email }, function(err, user) {
        if(user != null) {
            return res.json({ok: false, err: "user exists"});
        }

        if (req.body.image == undefined) //Si no esta especificat no enviem url de la imatge, ficara la default
        {
            var image = new Image(
                {
                    kind: 'big'
                }
            )
        } else
        {
            var image = new Image(
                {
                    kind: 'big',
                    url: req.body.image
                }
            )
        }

        image.save();


        var user = new User({
            name: req.body.name,
            email: req.body.email,
            surnames: req.body.surnames,
            image: image,
            isAmo: ( req.body.isAmo ?  req.body.isAmo : false),
            password: req.body.password
        });

        user.save();

        res.json({ok:true});
    });
}

exports.getOne = function(req, res) {
    User.findOne({ _id: req.params.id })
        .select('-password -isAmo -active')
        .populate('image')
        .exec( function(err, user) {
        res.send(user);
    });
}

exports.update = function(req, res) {
    var image = undefined;

   if (req.body.image != undefined)
    {
        console.log(req.body.image);
        var image = new Image(
            {
                kind: 'big',
                url: req.body.image
            }
        )
        image.save();
    }

    User.findOne({_id : req.params.id})
        .select('-password -isAmo -active')
        .populate('image')
        .exec(function (err, user)
        {
            if (!user) return res.json({ok: false , err: "This user does not exist"});

            if (req.body.name != undefined && req.body.name) user.name = req.body.name;
            if (req.body.surnames != undefined && req.body.surnames) user.surnames = req.body.surnames;
            if (req.body.email != undefined && req.body.email
                && req.body.email.indexOf('@gmail.com') > -1) user.email = req.body.email;
            if (undefined != image) user.image = image;
            if (req.body.active != undefined) user.active = req.body.active;
            if (req.body.password != undefined && req.body.password) user.password = req.body.password;

            user.save(function(err)
            {
                if (err) return res.json({ok: false});//res.send(400, "Error actualitzant les dades");

                var response = {user: user, ok: true } ;
                res.json(response);
            });

        });
}

exports.delete = function(req, res) {
    console.log("eliminem user");

    return User.findById(req.params.id, function(err, user) {
        if (user)
        {
            return user.remove(function (err) {
                if (!err) {
                    return res.json({ok: true, msg: "Removed!"});
                } else {
                    return res.json({ok: false, err: err});
                }
            });
        }
        else
        {
            return res.json({ok: false, err: err});
        }

    });
}

exports.exists = function(req, res, next)
{
    User.findOne({ _id: req.body.user_id }, function(err, user) {
        if(user == null) {
            return res.json({ok: false, err: "user does not exist"});
        } else
        {
            next();
        }
    });
}

//Retorna si l'usuari és empleat o amo segons l'email
exports.auth = function(req, res)
{
    User.findOne({ email: req.body.email }, function(err, user) {
        if(user == null) {
            return res.json({ok: false, err: "user does not exist"});
        } else
        {
            if(err) return res.json({ok: false, err: err});

            user.active = true;
            user.save();

            return res.json({ok: true, user:user});
        }
    });
}

exports.justAmo = function(req, res, next)
{
    User.findOne({ _id: req.body.user_id}, function(err, user) {
        if(user == null) {
            return res.json({ok: false, err: "User does not exist"});
        } else
        {
            if (user.isAmo == false) return res.json({ok: false, err: "You don't have the permissions to do this. Only bosses can."});
            next();
        }
    });
}

exports.justEmployee = function(req, res, next)
{
    User.findOne({ _id: req.body.user_id}, function(err, user) {
        if(user == null) {
            return res.json({ok: false, err: "User does not exist"});
        } else
        {
            if (user.isAmo == true) return res.json({ok: false, err: "You don't have the permissions to do this."});
            next();
        }
    });
}