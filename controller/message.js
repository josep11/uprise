

var Message = require('../model/message'),
    Message_Vote = require('../model/message_vote');

//1 - Mirar si l'email que ve amb el missatge es correcte
//2 - Mirar si l'email que ve amb el missatge te els permissos
//3 -

exports.get = function(req, res){
    Message.find({isSurvey:false})
        .sort('-data') //equivalent => .sort({'data':'desc'})
        .select('-isSurvey')
        .exec (function (err, message) {
        if (!err) {
            res.send(message);
        } else {
            return res.json({ok: false});
        }
    });

};

exports.getSurvey = function(req, res){
    Message.find({isSurvey:true})
        .sort('-data') //equivalent => .sort({'data':'desc'})
        .select('-isSurvey')
        .exec (function (err, message) {
        if (!err) {
            res.send(message);
        } else {
            return res.json({ok: false});
        }
    });

};

exports.create = function(req, res) {
    var user_id = req.body.user_id;

    if (!req.body.content || !user_id)
    {
        return res.json({ok: false, err: "O no hi ha contingut del missatge o no s'ha passat user id"});
    }

    var message = new Message({
        content: req.body.content,
        isSurvey: false
    });

    console.log("id missatge "+message._id);

    message.save(function (err)
        {
            if (err)
            {
                return res.json({ok: false, err: err.message});
            } else {

                //Creem la votació de l'usuari que l'ha pujat
                var message_vote = new Message_Vote({
                    user: user_id,
                    message: message._id
                });

                message_vote.save(function(err)
                {
                    if (err) return res.json({ok: false});

                });

            }
        });

    return res.json({message: message, ok: true}); //TODO TESTEJAR A VEURE SI FALLA

};

exports.getOne = function(req, res) {

    Message.findOne({ _id: req.params.id , isSurvey:false})
        .select('-__v')
        .exec( function(err, message) {
            if (err) return res.json({ok: false});

            if (null == message) res.json({ok: false, err: "No hi ha missatge amb aquesta ID, potser isSurvey=true"});
            return res.json(message);

        });
};

exports.getOneSurvey = function(req, res) {

    Message.findOne({ _id: req.params.id , isSurvey:true})
        .select('-__v')
        .exec( function(err, message) {
            if (err) return res.json({ok: false});

            if (null == message) res.json({ok: false, err: "No hi ha missatge amb aquesta ID, potser isSurvey=true"});
            return res.json(message);
        });
};

exports.update = function(req, res) {
    var user_id = req.body.user_id;

    //Message.findOne({_id : req.params.id},function (err, message) //TODO PROVISIONAAAAAAAAAAAAAAAAAAAAAAAAAAL
    Message.findOne({_id : req.params.id, isSurvey:false},function (err, message)
        {
            if (err || message == null || message == undefined) return res.json({ok: false, err: "Maybe this is no longer a message and it has been moved to surveys"});

            var comment = req.body.message_comment
            var isSurvey = req.body.isSurvey;

            if (undefined != comment && comment)
            {
                message.message_responses.push(comment);
            }

            if (undefined != isSurvey && null != isSurvey)
            {
                message.isSurvey = isSurvey;
                if (isSurvey == 1)
                {
                    message.message_responses = [];
                    message.votes = 0;
                    Message_Vote.remove({message: message._id}).exec(); //Esborrem totes les votacions a aquest

                }
            }

            message.save(function(err)
            {
                if (err) return res.json({ok: false});
                return res.json({message: message, ok: true });
            });
        });
};

exports.updateSurvey = function(req, res) {

    Message.findOne({_id : req.params.id, isSurvey:true},function (err, message)
    {
        if (err || message == null || message == undefined) return res.json({ok: false, err: "Maybe this is no longer a message and it has been moved to surveys"});

        message.votes++;

        message.save(function(err)
        {
            if (err) return res.json({ok: false});
            //message.toObject({ hide: 'secret _id', transform: true }); //TODO per ocultar camps en retornar
            return res.json({message: message, ok: true });
        });

    });
};

function deletea(req, res, isSurvey)
{
    Message.findOne({ _id: req.params.id , isSurvey:isSurvey})
        .exec(function(err, message) {
        if (message && !err)
        {
            return message.remove(function (err) {
                if (!err) {

                    Message_Vote.remove({message: message._id}) //Esborrem totes les votacions a aquest
                        .exec(function(err)
                        {
                            if (err) return res.json({ok: false, err:"Error eliminant les votacions del missatge"});
                            //return res.json({message: message, ok: true });
                            return res.json({ok:true, msg: "succesfully removed"});
                        });

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


exports.deleteMessage = function(req, res) {
    deletea(req, res, false);
};

exports.deleteSurvey = function(req, res) {
    deletea(req, res, true);
};

exports.createSurveyVote = function(req, res) {
    createVote(req, res, true);
};

exports.createMessageVote = function(req, res) {
    createVote(req, res, false);
};

function createVote(req, res, isSurvey)
{
    var user_id = req.body.user_id,
        message_id = req.params.id;


    if (user_id && message_id){
        Message_Vote.findOne({message : message_id, user: user_id})
            .exec(function (err, message_vote)
        {
            if (err)  return res.json({ok: false, err: err});
            if (message_vote) return res.json({ok: false, err: "Vot incorrecte, ja s'ha votat abans"}); //Si existeix retornem que el vot ja existeix

            //Si no existeix el creem
            var message_vote = new Message_Vote({
                user: user_id,
                message: message_id
            });

            message_vote.save(function(err)
            {
                if (err) return res.json({ok: false});

                //Actualitzar el numero de vots del missatge actual
                Message.findOne({ _id: message_id , isSurvey:isSurvey},function (err, message) {

                    if (err || !message) return res.json({ok: false, err:"No hi ha missatge per actualitzar els vots, o bé no és missatge"});
                    message.votes++;
                    message.save(function(err)
                    {
                        if (err) return res.json({ok: false});
                        return res.json({message: message, ok: true });
                    });
                });

            });
        });
    }
    else
    {
        return res.json({ok: false, err: "params o body especificats incorrectes"});
    }
};



