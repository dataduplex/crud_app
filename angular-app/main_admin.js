var myApp = angular.module('myApp', ['ng-admin']);
//var ui = require('./ui_entities');

myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
            }
            return $q.reject(rejection);
        }
    };
});


myApp.directive('approveSku', require('./product_definition/approve_sku').approveSku);
myApp.directive('batchApprove', require('./product_definition/approve_batch').batchApprove);
myApp.directive('batchUpdateRelease', require('./product_definition/release_batch').batchUpdateRelease);

myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});


myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
    console.log('Loc Storage:');
    console.log($window.localStorage);
    //console.log(window.localStorage.first_name);
    $scope.username =  $window.localStorage.username;
}]);



myApp.controller( 'logOutController', ['$scope', '$window',  function($scope, $window) {
    $scope.logout = function () {
        delete $window.localStorage.token;
        delete $window.localStorage.username;
        $window.location = 'http://localhost:8080/index.html';
    };

    $scope.passwordReset = function () {
        delete $window.localStorage.token;
        delete $window.localStorage.username;
        $window.location = 'http://localhost:8080/password_reset.html';
    };

}]);


/*
<a class="navLinkHcp" href="{{hcpurl}}" title="Habitat Conservation Plan" target="_blank" ng-click="linkModelFunc(hcpurl)">Habitat Conservation Plan</a>
*/

myApp.controller( 'redirectController', ['$scope', '$window',  function($scope, $window) {
    $scope.redirectFunc = function (url) {
        console.log('redirectFunc');
        $window.open(url);
    };
}]);


myApp.config(['NgAdminConfigurationProvider', function (nga) {

    var loggedInUser = window.localStorage.username;
    // create an admin application
    var admin = nga.application('Catalog Manager')
        .baseApiUrl('http://localhost:8080/pc_api/'); // main API endpoint

    admin.addEntity(nga.entity('product_definition'));
    admin.addEntity(nga.entity('image_urls'));  
    admin.addEntity(nga.entity('file_upload')); 
    admin.addEntity(nga.entity('imports')); 
    admin.addEntity(nga.entity('file_exports')); 
    admin.addEntity(nga.entity('sku_export_status'));
    admin.addEntity(nga.entity('approvals'));
    admin.addEntity(nga.entity('release_versions')); 


    var product_definition = require('./product_definition/config').product_definition;
    product_definition(nga, admin);



    var image_urls = require('./image_urls/config').image_urls;
    image_urls(nga, admin);

    var file_upload = require('./file_upload/config').file_upload;
    file_upload(nga, admin);    

    var imports = require('./imports/config').imports;
    imports(nga, admin);    

    var admin_tables = require('./admin_tables/config').admin_tables;
    admin_tables(nga, admin);    

    var approvals = require('./approvals/config').approvals;
    approvals(nga, admin);    

    admin.header(require('./header.html'));

    var menu_admin = require('./menu_admin');
    admin.menu(menu_admin.landing_menu(nga, admin));
    
    //admin.menu(require('./menu')(nga, admin));
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
