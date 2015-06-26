/*global angular*/
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.controller('main', function ($scope, $rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function () {
            //$scope.displayBanner = $location.$$path === '/dashboard';
        });
    });

    app.config(function (NgAdminConfigurationProvider, RestangularProvider) {
        var nga = NgAdminConfigurationProvider;

        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // use the custom query parameters function to format the API request correctly
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
            if (operation == "getList") {
                // custom pagination params
                if (params._page) {
                    params._start = (params._page - 1) * params._perPage;
                    params._end = params._page * params._perPage;
                }
                delete params._page;
                delete params._perPage;
                // custom sort params
                if (params._sortField) {
                    params._sort = params._sortField;
                    delete params._sortField;
                }
                // custom filters
                if (params._filters) {
                    for (var filter in params._filters) {
                        params[filter] = params._filters[filter];
                    }
                    delete params._filters;
                }
            }
            return { params: params };
        });

        var admin = nga.application('BuonJobs Admin') // application main title
            .baseApiUrl('https://uprise-josep11.c9.io/api/'); // main API endpoint

        
       // nga.registerFieldType('tax_rate', require('path/to/TaxRateField'));

        var user = nga.entity('users')
                    .identifier(nga.field('_id'));

        var message = nga.entity('messages')
                    .identifier(nga.field('_id'));

        var image = nga.entity('images')
                    .identifier(nga.field('_id'));
       
        // set the application entities
        admin
             .addEntity(user)
             .addEntity(image)
             .addEntity(message);

        // customize entities and views

        user.listView()
            .title('Ver usuarios')
            .order(0)
            .perPage(1)
            .fields([
                nga.field('_id').label('ID'), 
                nga.field('email').map(truncate),
                nga.field('nombreCompleto', 'template')
                    .label('Nom Complet')
                    .template('{{entry.values.name + " " + entry.values.surnames}}')
            ])
            .listActions(['show', 'edit', 'delete']);

        user.dashboardView()
            .fields([
                nga.field('name')
                    .label('Nombre')
                    .isDetailLink(true)
                    .map(truncate)
            ]);
        
        user.editionView()
            .title('Editar usuari {{entry.values.email}}')
            .actions(['list', 'show', 'delete'])
            .fields([
                nga.field('_id')
                    .label('ID')
                    .attributes({ placeholder: 'the post title', ngReadonly:true }), // you can add custom attributes, too
                    //.validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
                nga.field('email','email'),
                nga.field('name'),
                nga.field('isAmo', 'boolean')
                    .label('Es amo')
                
            ]);
            
        user.showView()
            .title('Detalls usuari {{entry.values.email}}')
            .actions(['list', 'edit', 'delete'])
            .fields(user.editionView().fields())
            .fields([
                nga.field('perfil','template')
                    .template('<img ng-cloak class="col-md-3 img-responsive" src="{{entry.values.image.url}}"/>'),
                
               
            ]);


        
        image.listView()
            .title('Ver imagenes')
            
            .listActions(['show', 'edit', 'delete'])
            .fields([
                nga.field('_id').label('ID'),
                nga.field('Imatge', 'template')
                    .template('<img ng-cloak class="col-md-3 img-responsive" src="{{entry.values.url}}"/>'),
                //nga.field('url')
            ]);
        
        image.showView()
            .title('Ver imagen')
            .fields(image.listView().fields())
            /*.fields([
                nga.field('Imatge', 'template')
                    .template('<img src="{{entry.values.url}}"/>')
            ])*/
            ;

        message.listView()
            .order(1)
            .perPage(10)
                .fields([
                nga.field('_id').label('ID'), 
                nga.field('message_responses'),
                nga.field('votes')
            ])
            .listActions(['show', 'edit', 'delete']);
            
        message.editionView()
            .fields([
                nga.field('_id').label('ID'), 
                nga.field('message_responses','wysiwyg'),
                nga.field('votes','number')
            ]);
            
        message.showView()
            .fields([
                nga.field('_id').label('ID'), 
                nga.field('message_responses','template')
                    //.template("{{entry.values.message_responses}}"),
                    .template('<ul><li ng-repeat="i in entry.values.message_responses track by $index">{{i}}</li></ul>'),
                nga.field('votes','number')
            ]);
            
        admin.menu(nga.menu()
            .addChild(nga.menu(user).icon('<span class="glyphicon glyphicon-user"></span>')) // customize the entity menu icon
            //.addChild(nga.menu(message).icon('<span class="glyphicon glyphicon-file"></span>')) // customize the entity menu icon
            .addChild(nga.menu(message).icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>')) // you can even use utf-8 symbols!
            .addChild(nga.menu(image).icon('<span class="glyphicon glyphicon-tags"></span>'))
            .addChild(nga.menu().title('Other')
                .addChild(nga.menu().title('Stats').icon('').link('/stats'))
            )
        );

        nga.configure(admin);
    });

    app.directive('listItems', ['$items', function($items){
        return {
            restrict: 'E',
            scope: { entry: '&' },
            template: '<ul><li ng-repeat="i in $items">{{i}}</li></ul>',
            /*link: function (scope) {
                scope.displayPost = function () {
                    $location.path('/show/posts/' + scope.entry().values.post_id);
                };
            }*/
        };
    }]);

    app.directive('postLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: { entry: '&' },
            template: '<p class="form-control-static"><a ng-click="displayPost()">View&nbsp;post</a></p>',
            link: function (scope) {
                scope.displayPost = function () {
                    $location.path('/show/posts/' + scope.entry().values.post_id);
                };
            }
        };
    }]);

    app.directive('sendEmail', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: { post: '&' },
            template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>',
            link: function (scope) {
                scope.send = function () {
                    $location.path('/sendPost/' + scope.post().values.id);
                };
            }
        };
    }]);

    // custom 'send post by email' page

    function sendPostController($stateParams, notification) {
        this.postId = $stateParams.id;
        // notification is the service used to display notifications on the top of the screen
        this.notification = notification;
    };
    sendPostController.prototype.sendEmail = function() {
        if (this.email) {
            this.notification.log('Email successfully sent to ' + this.email, {addnCls: 'humane-flatty-success'});
        } else {
            this.notification.log('Email is undefined', {addnCls: 'humane-flatty-error'});
        }
    }
    sendPostController.inject = ['$stateParams', 'notification'];

    var sendPostControllerTemplate =
        '<div class="row"><div class="col-lg-12">' +
            '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
            '<div class="page-header">' +
                '<h1>Send post #{{ controller.postId }} by email</h1>' +
                '<p class="lead">You can add custom pages, too</p>' +
            '</div>' +
        '</div></div>' +
        '<div class="row">' +
            '<div class="col-lg-5"><input type="text" size="10" ng-model="controller.email" class="form-control" placeholder="name@example.com"/></div>' +
            '<div class="col-lg-5"><a class="btn btn-default" ng-click="controller.sendEmail()">Send</a></div>' +
        '</div>';

    app.config(function ($stateProvider) {
        $stateProvider.state('send-post', {
            parent: 'main',
            url: '/sendPost/:id',
            params: { id: null },
            controller: sendPostController,
            controllerAs: 'controller',
            template: sendPostControllerTemplate
        });
    });

    // custom page with menu item
    var customPageTemplate = '<div class="row"><div class="col-lg-12">' +
            '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
            '<div class="page-header">' +
                '<h1>Stats</h1>' +
                '<p class="lead">You can add custom pages, too</p>' +
            '</div>' +
        '</div></div>';
    app.config(function ($stateProvider) {
        $stateProvider.state('stats', {
            parent: 'main',
            url: '/stats',
            template: customPageTemplate
        });
    });
    

}());