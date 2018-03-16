var myApp = angular.module('myApp', []);

//this is used to parse the profile
function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}


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


myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});

myApp.controller('UserCtrl', function ($scope, $http, $window) {
    //$scope.user = {username: 'Jay', password: 'secret'};
    $scope.isAuthenticated = false;
    $scope.welcome = '';
    $scope.message = '';

    $scope.submit = function () {
        $http
            .post('/authenticate', $scope.user)
            .success(function (data, status, headers, config) {
                //console.log('DATA');
                //console.log(data);
                $scope.isAuthenticated = true;
                var encodedProfile = data.token.split('.')[1];
                var profile = JSON.parse(url_base64_decode(encodedProfile));
                $window.localStorage.token = data.token;
                $window.localStorage.username = data.profile.username;
                $window.localStorage.role = data.profile.role;
                //$window.localStorage.last_name = profile.last_name;
                //$scope.welcome = 'Welcome ' + profile.first_name + ' ' + profile.last_name;
                $scope.welcome = 'Welcome ' + data.profile.username;
                //config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                
                $window.location.href = './pc_api/secure.html?token='+data.token;
            })
            .error(function (data, status, headers, config) {
                // Erase the token if the user fails to log in
                delete $window.localStorage.token;
                $scope.isAuthenticated = false;

                // Handle login errors here
                $scope.error = 'Error: Invalid user or password';
                $scope.welcome = '';
            });
    };

    $scope.logout = function () {
        $scope.welcome = '';
        $scope.message = '';
        $scope.isAuthenticated = false;
        delete $window.localStorage.token;
    };

    $scope.callRestricted = function () {
        $http({url: '/pc_api/restricted', method: 'GET'})
            .success(function (data, status, headers, config) {
                $scope.message = $scope.message + ' ' + data.name; // Should log 'foo'
            })
            .error(function (data, status, headers, config) {
                alert(data);
            });
    };

});


myApp.controller('PasswordCtrl', function ($scope, $http, $window) {

    $scope.submit = function () {
        $http
            .post('/password_reset', $scope.user)
            .success(function (data, status, headers, config) {
                $window.location.href = './index.html';
            })
            .error(function (data, status, headers, config) {
                $scope.error = 'Error: Password reset failed';
            });
    };

});



myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});