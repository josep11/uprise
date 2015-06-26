var express = require('express');
var routes = require('./routes');
var user = require('./controller/user'),
    message = require('./controller/message'),
    user_vote = require('./controller/user_vote'),
    employee_month = require('./controller/employee_month'),
    image = require('./controller/image');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

require('./routes/config')(app,express,path,__dirname); //Configuro


mongoose.connect('mongodb://admin:filos@oceanic.mongohq.com:10096/uprise');
//mongoose.connect('mongodb://localhost/uPrise');

mongoose.connection.on("connected", function()
{
   console.log("Mongoose s'ha connectat");
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


function setRoutes()
{
    app.get('/', routes.demo);
    app.get('/prova', routes.prova);
    app.get('/admin', routes.admin);

    //app.get('/api/*', function(){console.log("api");});

    app.get('/api/images',                   image.get);
    app.get('/api/images/:id',               image.getOne);

    app.get('/api/users',                   user.get);
    app.get('/api/users/:id',               user.getOne);
    app.post('/api/users',                  user.create);
    app.put('/api/users/:id',               user.update);
    app.delete('/api/users/:id',            user.delete);
    app.post('/api/users/auth',             user.auth);

    app.get('/api/messages',                message.get);
    app.get('/api/messages/:id',            message.getOne);
    app.post('/api/messages',               /*user.exists,*/ user.justEmployee,  message.create);
    app.put('/api/messages/:id',            message.update);
    app.delete('/api/messages/:id',         user.justAmo, message.deleteMessage);

    app.get('/api/surveys',                 message.getSurvey);
    app.get('/api/surveys/:id',             message.getOneSurvey);
    //app.put('/api/surveys/:id',           message.updateSurvey); //No es cridarà mai ja que les votacions es fan des de surveys/vote/:id
    app.delete('/api/surveys/:id',          user.justAmo, message.deleteSurvey);

    app.post('/api/messages/vote/:id',      user.justEmployee,   message.createMessageVote);
    app.post('/api/surveys/vote/:id',       user.justEmployee,   message.createSurveyVote);

    app.post('/api/users/vote/:id',         user.exists,   user_vote.create);
    app.delete('/api/users/vote/:id',       user.exists,   user_vote.delete);

    app.get('/api/employee_month',          employee_month.get);

    app.post('/api/photos', multipartMiddleware,  routes.photos);
}
setRoutes();
app.listen(app.get('port')); //Equivalent al de sota



/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/


//EXEMPLES MONGOOSE
/*


 var query = User.find({"name" : "provaMongoose"});

 query.select('email');

 query.exec(function (err, persons) {
 if (err) return handleError(err);

 persons.forEach(
 function(person){
 console.log('%s ', person.email);
 });
 })
*/

/*
 //############################### QUERY GUAPA #######################################

Person
    .find({ occupation: /host/ })
    .where('name.last').equals('Ghost')
    .where('age').gt(17).lt(66)
    .where('likes').in(['vaporizing', 'talking'])
    .limit(10)
    .sort('-occupation')
    .select('name occupation')
    .exec(callback);

 Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);

*/


//############################### EXEMPLE COMPLET #######################################

 (function()
 {
 var Schema = mongoose.Schema;

 var UserSchema = new Schema({
 name: { type: String, required: true },
 email: { type: String, required: true, unique: true }
 });


 var User = mongoose.model('User', UserSchema);

 var MessageSchema = new Schema({
 content: String,
 isSurvey: {type: Boolean, default: false},
 emails: Array,
 date: {type: Date, default: Date.now()}
 });

 var Message = mongoose.model("Message", MessageSchema);

 new Message({content:"Missatgeeee", emails: ["gg7@gmail.com"]}).save( function (err, message)
 {
 if (err) return "Error inserint message";

 var mailActual = "gg7@gmail.com"; //El mail que vol votar el missatge


 //Faig update del missatge simulant que l'hagués votat algun altre email

 if ( message.emails.indexOf(mailActual) == -1) //No ha votat encara
 {
 console.log("no ha votat encara");
 message.emails.push(mailActual);

 message.save(function(err)
 {if (err) return "Error inserint email extra a missatge";
 console.log(message);
 });
 } else
 {
 console.log("ja ha votat");
 }



 });

 new User({name: "provaMongoose", email: "gg8@gmail.com"}).save(function (err)
 {
 if (err) console.log("ERROR user ja existeix");
 else console.log("easy");
 //User.findById()
 User.find({name:'provaMongoose'},'name' , function (err, users) {
 if (!err) {
 //return console.log((users));
 } else {
 //return console.log(err);
 }
 });

 var query = User.find({"name" : "provaMongoose"});

 query.select('email');

 query.exec(function (err, persons) {
 if (err) return handleError(err);

 persons.forEach(
 function(person){
 // console.log('%s ', person.email);
 });
 })


 Message.find().sort('-date').exec(function(err,docs){
 //return console.log(docs);
 });


 });


 }); //();





