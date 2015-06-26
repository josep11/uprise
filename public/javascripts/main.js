// var admin = angular.module('myApp', ['ng-admin']);
var app = angular.module('myApp', ['ng-admin']);

admin.config(function (NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;
    // set the main API endpoint for this admin
    var admin = nga.application('My backend')
        .baseApiUrl('https://uprise-josep11.c9.io/api/');

    // define an entity mapped by the http://localhost:3000/posts endpoint
    var user = nga.entity('users');
    admin.addEntity(user);

    // set the list of fields to map in each post view
    user.listView().fields(/* see example below */);
    user.creationView().fields(/* see example below */);
    user.editionView().fields(/* see example below */);

    nga.configure(app);
});