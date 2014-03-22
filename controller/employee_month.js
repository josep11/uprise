var User_Vote = require('../model/user_vote'),
    user = require('../controller/user');




exports.get = function(req, res){

    User_Vote.count({}, function(err, c)
        {
            console.log('Numero de vots TOTAAAAAAALS = ' + c);
            if ( c == 0 ) return res.json({ok: false, err: "There is no employee of the month yet. No one has voted."});

        });

    User_Vote
        .aggregate(
        { $group: {
            _id: { user_votat: '$user_votat' , user_votador: '$user_votador'} //Agrupem per eliminar duplicats
        }},
        { $group: {
            _id: '$_id.user_votat', count: { $sum: 1 } //Agrupem per la id de l'user_votat i incrementem cada cop
        }},
        //{ $sort : { count : 1 }}, //va be
        { $project: { _id:0, user_votat: '$_id', count: 1} }, //Canviem el nom id per user votat i mostrem el count
        { $sort: { count: -1}} //Ordenem amb ordre descendent de manera que a la casella 0 hi haurà el més votat
    )
        .exec( function(err, result)
        {
            if (err){ res.json({ok : false, err: err})}
            if (!result)
            {
                return res.json( {ok:false , err:"No s'ha trobat correctament l'empleat del mes"});
               //return false;
            }
            req.params.id = result[0].user_votat;
            user.getOne(req,res); //Retornara les dades de l'employee of the month
        });
}

/*
 User_Vote.find()
 //.populate("user_votador user_votat")
 .exec( function(err, result)
 {
 console.log("\nToooots: \n\n");
 console.log(result); //Obtinc tots els usuaris
 });
 */
