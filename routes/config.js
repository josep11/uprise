/**
 * Created by JOSEP on 17/03/14.
 */


var port = 3000;


module.exports = function(app, express, path, dirname)
{
    'use strict';
    app.set('port', process.env.PORT || port);
    app.set('views', path.join(dirname, 'views'));
   //app.set('view engine', 'jade');

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(express.methodOverride());  //Per pujar arxius
    app.use(express.multipart());       //Per pujar arxius

    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    
    app.use(express.static(path.join(dirname, 'public')));
    //serve static templates from folder
    app.use('/templates', express.static(path.join(dirname, 'public', 'templates')));
    
    //In order to use bower components as <script src="/bower_components/..."></script>
    app.use('/bower_components', express.static(path.join(dirname, 'bower_components')));

}
