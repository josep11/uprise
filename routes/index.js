var User = require('../model/user'),
    crypto  =require('crypto');



exports.angular = function(req, res){
//   res.send('aaa'); return;
    res.render('demo', {
        //yourName: 'Josep'
    });
};

exports.prova = function(req, res){
    res.render('prova', {});  
};


exports.admin = function(req, res){
    User.find()
        .select(' -__v')// -isAmo') //TODO DESCOMENTAR, NOMES SERVEIX PER DEBUGAR
        .populate('image')
        .exec (function (err, users) {
        if (!err) {
            res.render('admin', {
                "userlist" : users
            });
        } else {
            return res.json({ok: false, err: err});
        }
    });
};

exports.photos = function(req, res) {

    //console.log("id =============== " +req.body.id);
    var id = req.body.id;
    if (!id)
    {
        crypto.randomBytes(48, function(ex, buf) {
            id = buf.toString('hex');
            pujaImatge(req,res,id);
        });
    }else
    {
        pujaImatge(req,res,id);
    }



};

function pujaImatge(req,res,id)
{
    var targetPath = '/images/' + id,
        oldPath = req.files.userPhoto.path;

		console.log("\n\n\n");
    console.log("path userfoto "+oldPath);
    console.log("target path = "+targetPath);
		console.log("\n\n\n");
	
	
    require('fs').rename(
        oldPath,
        './public' + targetPath,
        function(error) {
            if(error) {
                res.send({
                    error: 'Ah crap! Something bad happened'+error
                });
                return;
            }

            res.send({
                id: req.body.id,
                path: targetPath
            });
        }
    );
}