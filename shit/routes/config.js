/**
 * Created by JOSEP on 17/03/14.
 */


var port = 3000;


module.exports = function(app, express, path, dirname)
{

    app.set('port', process.env.PORT || port);
    app.set('views', path.join(dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(dirname, 'public')));

}
