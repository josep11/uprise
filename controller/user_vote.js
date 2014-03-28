var User_Vote = require('../model/user_vote'),
    User = require('../model/user');

exports.create = function (req, res)
{
    var user_votador = req.body.user_id,
        user_votat = req.params.id;

     if ( paramsOk(res, user_votador, user_votat) )
    {

        User.findOne({_id: user_votat}, function(err, result)
        {
            if (!result || err) return res.json({ok:false, err: "The user that you are trying to vote does not exist"});
            console.log("intento votar");
            //Votar sempre i quan no s'hagi votat abans
            User_Vote.findOne({user_votador : user_votador, user_votat: user_votat})
                .exec(function (err, user_vote)
                {
                    if (err)  return res.json({ok: false, err: err});
                    if (user_vote) return res.json({ok: false, err: "Vot incorrecte, ja s'ha votat abans"}); //Si existeix retornem que el vot ja existeix


                    user_vote = new User_Vote({ //Si no existeix el creem
                        user_votador : user_votador,
                        user_votat : user_votat
                    });

                    user_vote.save(function(err)
                    {
                        if (err) return res.json({ok: false, err: err});
                        return res.json({user_vote: user_vote, ok: true }); //PROVISIONAL NO RETORNAR: DADES SENSIBLES
                        //return res.json({ ok: true , msg: "Votació realitzada satisfactòriament"});
                    });
                });


        });

    }


};

exports.delete = function (req, res)
{
    var user_votador = req.body.user_id,
        user_votat = req.params.id;

    if ( paramsOk(res, user_votador, user_votat) )
    {
        User_Vote.remove({user_votador : user_votador, user_votat: user_votat})
            .exec(function(err)
            {
                if (err) return res.json({ok: false, err:"Error eliminant vot a usuari"});
                return res.json({ok: true, msg: "Succesfully removed"});
            });
    }
}

function paramsOk(res, user_votador, user_votat)
{
    if (!user_votador || !user_votat){
        res.json({ok: false, err: "Params o body especificats incorrectes. Pot ser que no existeixi usuari votat o usuari votador"});
        return false;
    }else if (user_votat.localeCompare(user_votador) == 0)
    {
            res.json({ok: false, err: "No et pots votar a tu mateix"});
            return false;
    }

    return true;
}